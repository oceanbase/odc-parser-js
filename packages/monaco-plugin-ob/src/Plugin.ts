import * as monaco from 'monaco-editor';
import { setup as setupOBMySQL } from './obmysql';
import { setup as setupOracle } from './oboracle';
import { setup as setupMySQL } from './mysql';
import theme from './theme';
import { IModelOptions } from './type';



export class PLugin {
    
    modelOptionsMap: Map<string, IModelOptions | null> = new Map();

    public setup(features: ("mysql" | "obmysql" | "oboracle")[] = ["mysql", "obmysql", "oboracle"]) {
        features.forEach(item => {
            switch (item) {
                case "mysql": {
                    setupMySQL(this);
                    break;
                }
                case "obmysql": {
                    setupOBMySQL(this);
                    break;
                }
                case "oboracle": {
                    setupOracle(this);
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