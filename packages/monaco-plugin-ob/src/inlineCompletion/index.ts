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
        const selectedSuggestionInfo = context.selectedSuggestionInfo;
        if (selectedSuggestionInfo) {
            return;
        }
        const plugin = this.getModelOptions(modelId);
        if (!plugin?.llm?.completions) {
            return;
        }
        const editorValue = model.getValue();
        const positionOffset = model.getOffsetAt(position);
        const inputWithOffset = editorValue.substring(0, positionOffset) + '|' + editorValue.substring(positionOffset);
        return new Promise(async (resolve, reject) => {
            const version = this.modelVersion[modelId] ? (this.modelVersion[modelId] + 1) : 1;
            this.modelVersion[modelId] = version;
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (version !== this.modelVersion[modelId]) {
                resolve({
                    items: []
                })
                return;
            }
            const tables = await plugin?.getTableList?.() || [];
            const prompt = "你是一个SQL补全机器人，来完成代码补全的工作。数据库信息为：" 
            + `SQL 方言：${model.getLanguageId()}`
            + `表名：${tables?.slice(50).join(",")}`
            + "。"
            + "给你一段代码，代码中的 ｜ 代表光标位置，请输出这个位置需要填充的SQL代码。"
            + `只输出代码内容，不要解释，如果你不确定，请返回IDONTKNOW，假如有需要用户自定义的变量，请用 \${序号:变量名} 包裹。例如输入 “create | aa (id int);”，输出 “table”。以下是输入： \n${inputWithOffset}`;
            
            const value = await plugin?.llm?.completions(prompt); 
            if (!value || value.includes?.('IDONTKNOW')) {
                resolve({
                    items: []
                })
                return;
            }
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
