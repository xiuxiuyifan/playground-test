import type React from "react";

// 引入 html 文件原始的内容，不进行解析
import iframeRaw from "./iframe.html?raw";
import { useContext, useEffect, useRef, useState } from "react";
import { PlaygroundContext } from "../PlaygroundContext";
import { compile } from "./compiler";
import Editor from "../Editor";
import { IMPORT_MAP_FILE_NAME } from "../files";
import { Message } from "../Message";
import CompilerWorker from "./compiler.worker?worker";
import { debounce } from "lodash-es";

// 用 URL.createObjectURL + Blob 生成 blob url 设置到 iframe 的 src 就好了：

// const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

// const Preview: React.FC = () => {
//     return (
//         <iframe src={iframeUrl} style={{ width: '100%', height: '100%', padding: 0, border: 'none' }}></iframe>
//     )
// }

interface MessageData {
    data: {
        type: string;
        message: string;
    };
}

const Preview = () => {
    const getIframeUrl: any = () => {
        // 替换 iframe 中的 importmap  和编译后的代码
        const res = iframeRaw
            .replace(
                '<script type="importmap"></script>',
                `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
            )
            .replace(
                '<script type="module" id="appSrc"></script>',
                `<script type="module" id="appSrc">${compileCode}</script>`
            );
        return URL.createObjectURL(new Blob([res], { type: "text/html" }));
    };

    // 从全局的 context 中获取 文件列表
    const { files } = useContext(PlaygroundContext);

    const [compileCode, setCompilerCode] = useState("");
    const [iframeUrl, setIframeUrl] = useState(getIframeUrl());
    const [error, setError] = useState("");

    const handleMessage = (msg: MessageData) => {
        const { type, message } = msg.data;
        if (type === "ERROR") {
            setError(message);
        }
    };

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    // 一进来就编译文件  和 当 files 对象发生变化的时候，就重新从入口文件开始编译

    // import map.json 变化之后，和 编译后的代码变化之后，重新生成 iframe 的 src
    useEffect(() => {
        setIframeUrl(getIframeUrl());
    }, [files[IMPORT_MAP_FILE_NAME].value, compileCode]);

    const compilerWorkerRef = useRef<Worker>(null);

    useEffect(() => {
        if (!compilerWorkerRef.current) {
            compilerWorkerRef.current = new CompilerWorker();
            compilerWorkerRef.current.addEventListener("message", ({ data }) => {
                console.log("worker", data);
                //  拿到 woker 线程传回来的编译后的代码：
                if (data.type === "COMPILED_CODE") {
                    console.log('编译结果', data.data)
                    setCompilerCode(data.data);
                } else {
                    console.log("error", error);
                }
            });
        }
    }, []);

    // 主线程这边给 worker 线程传递 files，然后拿到 woker 线程传回来的编译后的代码：
    useEffect(
        debounce(() => {
            // const res = compile(files);
            // setCompilerCode(res);
            if (!compilerWorkerRef.current) return;
            compilerWorkerRef.current.postMessage(files);
        }, 500),
        [files]
    );

    return (
        <div style={{ height: "100%" }}>
            {/* <Editor
                file={{
                    name: 'dist.js',
                    value: compileCode,
                    language: 'javascript'
                }}
            /> */}
            <iframe
                src={iframeUrl}
                style={{
                    width: "100%",
                    height: "100%",
                    padding: 0,
                    border: "none",
                }}
            ></iframe>
            <Message type="error" content={error} />
        </div>
    );
};

export default Preview;
