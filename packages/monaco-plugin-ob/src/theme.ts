import * as monaco from 'monaco-editor';

const data: {
  key: string;
  config: monaco.editor.IStandaloneThemeData;
}[] = [
  {
    key: "obwhite",
    config: {
      "base": 'vs' as any,
      "inherit": true,
      "rules": [
        {
          "foreground": "09885A",
          "token": "comment"
        }
      ],
      "colors": {
        "editor.foreground": "#3B3B3B",
        "editor.background": "#FFFFFF",
        "editor.selectionBackground": "#BAD6FD",
        "editor.lineHighlightBackground": "#00000012",
        "editorCursor.foreground": "#000000",
        "editorWhitespace.foreground": "#BFBFBF"
      }
    }
  },
  {
    key: "obdark",
    config: {
      "base": 'vs-dark' as any,
      "inherit": true,
      "rules": [
        {
          "foreground": "F7F9FB",
          "token": "identifier"
        },
        {
          "foreground": "98D782",
          "token": "number"
        }
      ],
      colors: {}
    }
  }
]

export default data