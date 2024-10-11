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
        return new Promise<monaco.languages.InlineCompletions<monaco.languages.InlineCompletion> | null | undefined>(async (resolve, reject) => {
            await new Promise((resolve) => setTimeout(() => resolve(null), 500));
            if (version !== this.modelVersion[modelId] || token.isCancellationRequested) {
                resolve({
                    items: []
                })
                return;
            }
    
            let value = await plugin?.llm?.completions(editorValue, positionOffset); 
            if (token.isCancellationRequested) {
                resolve(null);
                return;
            }
            if (!value) {
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
        }).catch(e => {
            console.log('inline completion: ', e)
            return {
                items: []
            }
        })
    }
}

export default MonacoInlineComplete;
