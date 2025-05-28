import MonacoEditor, {
    type EditorProps,
    type OnMount,
} from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { createATA } from "./ata";

// 整理传入的参数
export interface EditorFile {
    name: string;
    value: string;
    language: string;
}

interface Props {
    file: EditorFile;
    onChange?: EditorProps["onChange"];
    options?: editor.IStandaloneEditorConstructionOptions;
}

function Editor(props: Props) {
    const { file, onChange, options } = props;

    const code = `export default function App() {
            return <div>xxx</div>
    }
        `;

    const handleEditorMount: OnMount = (editor, monaco) => {
        // 处理格式化
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction("editor.action.formatDocument")?.run();
        });
        // 添加 ts 编译预置参数
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
            // 3.如何理解esModuleInterop?
            // 兼容只有umd，cjs方式且没有暴露deault属性的包，添加default属性，从而使得import a from "a"或者import * as a from "a"引入的包，不会报没有default属性。例如query-string@7.1.1这样的包。
            // 保险起见，建议开启这个配置。
            esModuleInterop: true,
        });

        // import 导入添加类型提示
        const ata = createATA((code, path) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                code,
                `file://${path}`
            );
        });

        editor.onDidChangeModelContent(() => {
            ata(editor.getValue());
        });
        // 就是最开始获取一次类型，然后内容改变之后获取一次类型，获取类型之后用 addExtraLib 添加到 ts 里。
        ata(editor.getValue());
    };

    return (
        <MonacoEditor
            height="100%"
            language={file.language}
            value={file.value}
            path={file.name}
            onMount={handleEditorMount}
            onChange={onChange}
            options={{
                fontSize: 14,
                scrollBeyondLastLine: false,
                minimap: {
                    enabled: false,
                },
                scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                },
                ...options,
            }}
        />
    );
}

export default Editor;
