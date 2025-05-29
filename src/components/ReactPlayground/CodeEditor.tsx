import { useContext } from "react";
import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "./PlaygroundContext";
import { debounce } from "lodash-es";

export default function CodeEditor() {
    const {
        files,
        removeFile,
        addFile,
        updateFileName,
        setFiles,
        selectedFileName
    } = useContext(PlaygroundContext)

    // 取出当前选中的文件，从 context 中读取
    const file = files[selectedFileName]

    function onEditorChange(value?: string) {
        //  给 当前文件更新内容
        files[file.name].value = value!
        // 更新 files 内容
        setFiles({
            ...files
        })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <FileNameList />
            <Editor file={file} onChange={debounce(onEditorChange, 250)} />
        </div>
    )
}