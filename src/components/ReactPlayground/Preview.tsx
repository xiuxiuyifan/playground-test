import type React from "react";

// 引入 html 文件原始的内容，不进行解析
import iframeRaw from '../../example/iframe.html?raw'

// 用 URL.createObjectURL + Blob 生成 blob url 设置到 iframe 的 src 就好了：

const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

const Preview: React.FC = () => {
    return (
        <iframe src={iframeUrl} style={{ width: '100%', height: '100%', padding: 0, border: 'none' }}></iframe>
    )
}

export default Preview