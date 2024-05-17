import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useUpdate } from 'ahooks';
import * as monaco from 'monaco-editor';
import { initVimMode } from 'monaco-vim';
import './style.css';

window.obMonaco = {
    getWorkerUrl: (type: string) => {
        switch (type) {
            case 'mysql': {
                return 'ob-workers/mysql.js'
            }
            case 'obmysql': {
                return 'ob-workers/obmysql.js'
            }
            case 'oboracle': {
                return 'ob-workers/oracle.js'
            }
        }
    }
}
let plugin: any;
async function initPlugin() {
    import('../../../../dist/index').then(module => {
        const Plugin = module.default;
        plugin = new Plugin();
        plugin.setup();
    })
}

initPlugin();


async function completions(input: string) {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer sk-792f40a250ab459098c6760f9b48bb04'
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            top_p: 0.1,
            messages: [
                {
                    content: input,
                    role: "user"
                }
            ]
        })
    })
    const json = await res.json();
    return json?.choices?.[0]?.message?.content


}

async function qwenCompletions(input: string) {
    const response = await fetch("http://127.0.0.1:7001/api/completions", {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
           input
        })
    })
    const json = await response?.text();
    console.log(json)
    return json
}

export default function () {

    const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
    const dom = useRef<HTMLDivElement | null>(null);
    const vim = useRef<any>();
    const [theme, setTheme] = useState<string>("obwhite");
    const update = useUpdate()
    const editorIns = editor.current;
    const model = editorIns?.getModel();

    function addVim() {
        vim.current = initVimMode(editor.current, document.getElementById('my-statusbar'))
    }

    function removeVim() {
        vim.current?.dispose();
        vim.current = null;
    }

    useEffect(() => {
        if (theme && editorIns) {
            editorIns.updateOptions({
                theme
            })
        }
    }, [theme])

    useEffect(() => {
        if (dom.current) {
            editor.current = monaco.editor.create(dom.current, {
                language: 'obmysql',
                theme: theme,
                wordBasedSuggestions: false
            });
            const model = editor.current.getModel()?.id;
            if (model) {
                plugin.setModelOptions(model, {
                    delimiter: ';',
                    llm: {
                        async completions(input: string) {
                            return await qwenCompletions(input)
                        }
                    },
                    async getTableList() {
                        return [
                            'user_table',
                            'history_table'
                        ]
                    },
                    async getFunctions() {
                        return [
                            {
                                name: 'userFunction1',
                                desc: 'mockfunction'
                            }
                        ]
                    },
                    async getSchemaList() {
                        return [
                            'schema1',
                            'schema2'
                        ]
                    },
                    async getTableDDL() {
                        return `create table aa (
    id int,
    uname varchar(20)
);
                        `
                    },
                    async getSchemaInfo() {
                        return `schema desc`
                    },
                    async getViewList() {
                        return [
                            'user_view',
                            'history_view'
                        ]
                    },
                    async getTableColumns(tableName, dbName?) {
                        return [
                            {
                                columnName: tableName + '_id',
                                columnType: 'int'
                            },
                            {
                                columnName: tableName + '_name',
                                columnType: 'varchar'
                            },
                            {
                                columnName: tableName + '_age',
                                columnType: 'int'
                            }
                        ]
                    },
                    async getDataTypes() {
                        return [
                            'CHAR',
                            'VARCHAR',
                            'TEXT',
                            'LONGTEXT',
                            'INTEGER',
                            'DECIMAL',
                            'FLOAT',
                            'DOUBLE',
                            'DATE',
                            'TIME',
                            'TIMESTAMP',
                            'YEAR',
                            'BINARY',
                            'VARBINARY',
                        ]
                    },
                })
            }
            editor.current.onDidChangeConfiguration(() => {
                update()
            })
            editor.current.onDidChangeModelLanguage(() => {
                update()
            })
            // addVim();
            update()
        }
        return () => {
            editor.current?.dispose();
            const modelId = editor.current?.getModel()?.id;
            modelId && plugin.setModelOptions(modelId, null)
            removeVim();
        }
    }, [])


    return <div className="app">
        <div className="editorbox" >
            <div className="editor" id="root" ref={dom}></div>
            <div id="my-statusbar" style={{ flex: 0, flexBasis: 20, fontSize: 14, padding: 2, lineHeight: '16px', background: '#fafafa' }}></div>
        </div>
        <div className="content">
            <button onClick={() => {
                model && monaco.editor.setModelLanguage(model, 'oboracle')
            }}>oracle</button>
            <button onClick={() => {
                model && monaco.editor.setModelLanguage(model, 'obmysql')
            }}>obmysql</button>
            <button onClick={() => {
                model && monaco.editor.setModelLanguage(model, 'mysql')
            }}>mysql</button>
            <button onClick={() => {
                setTheme("obwhite")
            }}>theme: white</button>
            <button onClick={() => {
                setTheme("obdark")
            }}>theme: dark</button>
            <button onClick={() => { addVim() }}>open vim mode</button>
            <button onClick={() => { removeVim() }}>remove vim</button>
            <div>
                当前插件：{editorIns?.getModel()?.getLanguageId()}
            </div>
            {/* {JSON.stringify(editorIns?.getOptions()., null, 4)} */}
        </div>
    </div>
}