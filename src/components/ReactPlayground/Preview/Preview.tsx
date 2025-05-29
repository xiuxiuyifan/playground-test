import type React from "react";

// 引入 html 文件原始的内容，不进行解析
import iframeRaw from '../../../example/iframe.html?raw'
import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../PlaygroundContext";
import { compile } from "./compiler";
import Editor from "../Editor";

// 用 URL.createObjectURL + Blob 生成 blob url 设置到 iframe 的 src 就好了：

const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

// const Preview: React.FC = () => {
//     return (
//         <iframe src={iframeUrl} style={{ width: '100%', height: '100%', padding: 0, border: 'none' }}></iframe>
//     )
// }


const Preview = () => {
    const { files } = useContext(PlaygroundContext)

    const [compileCode, setCompilerCode] = useState('')

    // 一进来就编译文件  和 当 files 对象发生变化的时候，就重新从入口文件开始编译
    useEffect(() => {
        const res = compile(files)
        setCompilerCode(res)
    }, [files])


    return (
        <div style={{ height: '100%', }}>
            <Editor
                file={{
                    name: 'dist.js',
                    value: compileCode,
                    language: 'javascript'
                }}
            />
        </div>
    )
}

export default Preview