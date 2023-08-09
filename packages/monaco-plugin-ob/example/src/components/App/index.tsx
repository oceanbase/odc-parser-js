import React from "react";
import { useRef, useEffect } from "react";
import { useUpdate } from 'ahooks';
import * as monaco from 'monaco-editor';
import { initVimMode } from 'monaco-vim';
import Plugin from '../../../../dist/index';
import './style.css';

const plugin = new Plugin();
plugin.setup();
export default function () {

    const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
    const dom = useRef<HTMLDivElement | null>(null);
    const vim = useRef<any>();
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
        if (dom.current) {
            editor.current = monaco.editor.create(dom.current, {
                language: 'obmysql',
                theme: 'obwhite',
                wordBasedSuggestions: false
            });
            const model = editor.current.getModel()?.id;
            if (model) {
                plugin.setModelOptions(model, {
                    delimiter: ';',
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
                    async getTableDDL () {
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
                                columnName: tableName+'column1',
                                columnType: 'varchar'
                            },
                            {
                                columnName: tableName+'column2',
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
                            'FLOAT',
                            'DATETIME',
                            'DATE'
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
            }}>mysql</button>
            <button onClick={() => { addVim() }}>open vim mode</button>
            <button onClick={() => { removeVim() }}>remove vim</button>
            <div>
                当前插件：{editorIns?.getModel()?.getLanguageId()}
            </div>
            {/* {JSON.stringify(editorIns?.getOptions()., null, 4)} */}
        </div>
    </div>
}