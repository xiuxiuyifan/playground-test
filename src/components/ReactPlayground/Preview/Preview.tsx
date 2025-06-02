import type React from "react";

// 引入 html 文件原始的内容，不进行解析
import iframeRaw from './iframe.html?raw'
import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../PlaygroundContext";
import { compile } from "./compiler";
import Editor from "../Editor";
import { IMPORT_MAP_FILE_NAME } from "../files";

// 用 URL.createObjectURL + Blob 生成 blob url 设置到 iframe 的 src 就好了：

// const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

// const Preview: React.FC = () => {
//     return (
//         <iframe src={iframeUrl} style={{ width: '100%', height: '100%', padding: 0, border: 'none' }}></iframe>
//     )
// }


const Preview = () => {
       const getIframeUrl: any = () => {
        // 替换 iframe 中的 importmap  和编译后的代码
        const res = iframeRaw.replace(
            '<script type="importmap"></script>',
            `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
        ).replace(
            '<script type="module" id="appSrc"></script>', 
            `<script type="module" id="appSrc">${compileCode}</script>`
        )
        return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
    }

    const { files } = useContext(PlaygroundContext)

    const [compileCode, setCompilerCode] = useState('')
    const [iframeUrl, setIframeUrl]  = useState(getIframeUrl())

    // 一进来就编译文件  和 当 files 对象发生变化的时候，就重新从入口文件开始编译
    useEffect(() => {
        const res = compile(files)
        setCompilerCode(res)
    }, [files])

 
    // import map.json 变化之后，和 编译后的代码变化之后，重新生成 iframe 的 src
    useEffect(() => {
        setIframeUrl(getIframeUrl())
    }, [files[IMPORT_MAP_FILE_NAME].value, compileCode])


    return (
        <div style={{ height: '100%', }}>
            {/* <Editor
                file={{
                    name: 'dist.js',
                    value: compileCode,
                    language: 'javascript'
                }}
            /> */}
            <iframe src={iframeUrl} style={{
                width: '100%',
                height: '100%',
                padding: 0,
                border: 'none'
            }}></iframe>
        </div>
    )
}

export default Preview