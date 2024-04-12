import * as monaco from 'monaco-editor';
import theme from './theme';
import { IModelOptions } from './type';



export class PLugin {
    
    modelOptionsMap: Map<string, IModelOptions | null> = new Map();

    public setup(features: ("mysql" | "obmysql" | "oboracle")[] = ["mysql", "obmysql", "oboracle"]) {
        features.forEach(item => {
            switch (item) {
                case "mysql": {
                    import('./mysql').then(module => {
                        module.setup(this);
                    })
                    break;
                }
                case "obmysql": {
                    import('./obmysql').then(module => {
                        module.setup(this);
                    })
                    break;
                }
                case "oboracle": {
                    import('./oboracle').then(module => {
                        module.setup(this);
                    })
                    break;
                }
            }
        })
        theme.forEach(item => {
            monaco.editor.defineTheme(item.key, item.config)
        })
    }

    public setModelOptions(modelId: string, modelOptions: IModelOptions | null) {
        this.modelOptionsMap.set(modelId, modelOptions);
    }
}