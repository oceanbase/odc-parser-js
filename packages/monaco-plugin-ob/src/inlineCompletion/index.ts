import * as monaco from 'monaco-editor';
import { PLugin } from '../Plugin';

class MonacoInlineComplete implements monaco.languages.InlineCompletionsProvider {
    freeInlineCompletions(completions: monaco.languages.InlineCompletions<monaco.languages.InlineCompletion>): void {
        
    }
    /**
     * 用来记录当前model最新的版本号，避免一个model多次触发补全
     */
    modelVersion: Record<monaco.editor.IModel["id"], number> = {};
    triggerCharacters?: string[] | undefined = ['.'];
    plugin: PLugin | null = null;
    constructor(plugin: PLugin) {
        this.plugin = plugin;
    }
    public getModelOptions(modelId: string) {
        return this.plugin?.modelOptionsMap.get(modelId);
    }
    public provideInlineCompletions(model: monaco.editor.ITextModel, position: monaco.Position, context: monaco.languages.InlineCompletionContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.InlineCompletions<monaco.languages.InlineCompletion>> {
        const modelId = model.id;
        const version = this.modelVersion[modelId] ? (this.modelVersion[modelId] + 1) : 1;
        this.modelVersion[modelId] = version;
        const currentToken = model.getWordAtPosition(position)
        const plugin = this.getModelOptions(modelId);
        if (!plugin?.llm?.completions) {
            return;
        }
        const editorValue = model.getValue();
        const positionOffset = model.getOffsetAt(position);
        const inputWithOffset = editorValue.substring(0, positionOffset) + '|' + editorValue.substring(positionOffset);
        return new Promise(async (resolve, reject) => {
            await new Promise((resolve) => setTimeout(() => resolve(null), 500));
            if (version !== this.modelVersion[modelId] || token.isCancellationRequested) {
                resolve({
                    items: []
                })
                return;
            }
            const tables = (await plugin?.getTableList?.())?.slice(0, 30) || [];
            let tableColumns = {};
            for(let table of tables) {
                tableColumns[table] = await plugin?.getTableColumns?.(table);
            }
            const tablePrompt = Object.keys(tableColumns).map(tableName => {
                return `${tableName}(${tableColumns[tableName]?.map(c => c.columnName).join(', ')})`
            })
            const prompt = "You are an SQL autocomplete bot tasked with completing code segments. Here's the database information:\n" 
            + `SQL Dialect: ${model.getLanguageId()} \n`
            + `Tables: ${tablePrompt}\n`

            + "Your job is to fill in the SQL code at the position indicated by the '|' cursor in the given code segment. Your task is to provide the necessary SQL code that fits at the cursor's location and ensure that the code formatting is beautified. Do not include explanations. If you are unsure of the completion, respond with 'IDONTKNOW'."
            + "Any variables that the user must define should be wrapped in ${index:variable_name} format. For example, given the input 'create | aa (id int);', the expected output would be 'table'. "
            + `Here is the input for your task: \n${inputWithOffset}`;
            
            let value = await plugin?.llm?.completions(prompt); 
            if (token.isCancellationRequested) {
                resolve(null);
                return;
            }
            if (!value || value.includes?.('IDONTKNOW')) {
                resolve({
                    items: []
                })
                return;
            }
            value = (currentToken?.word || '') + value
            resolve(
                {
                    items: [
                        {
                            insertText: {
                                snippet: value
                            }
                        }
                    ]
                }
            )
        })
    }
}

export default MonacoInlineComplete;
