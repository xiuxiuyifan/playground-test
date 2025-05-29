import { transform } from "@babel/standalone";
import type { Files } from "../PlaygroundContext";
import { ENTRY_FILE_NAME } from "../files";
import type { PluginObj } from "@babel/core";



export const babelTransform = (filename: string, code: string, files: Files) => {

    let result = ''

    try {
        result = transform(code, {
            presets: ['react', 'typescript'],
            filename,
            plugins: [customResolver(files)],
            retainLines: true // retainLines 是编译后保持原有行列号不变。
        }).code!
    } catch (error) {
        console.log(error, "编译出错")
    }
    return result
}



// 要对所有文件都进行编译
export const compile = (files: Files) => {
    // 从入口文件 转换 import 导入
    const main = files[ENTRY_FILE_NAME]
    return babelTransform(ENTRY_FILE_NAME, main.value, files)
}



function customResolver(files: Files): PluginObj {
    return {
        visitor: {
            ImportDeclaration(path) {
                let modulePath = path.node.source.value
                // 如果是 .开头
                if (modulePath.startsWith('.')) {
                    // 获取  import 文件的 源文件字符串
                    const file = getModuleFile(files, modulePath)
                    if (!file) {
                        return
                    }
                    if (file.name.endsWith('.css')) {
                        path.node.source.value = css2Js(file)
                    } else if (file.name.endsWith('.json')) {
                        path.node.source.value = json2Js(file)
                    } else {
                        path.node.source.value = URL.createObjectURL(
                            new Blob([babelTransform(file.name, file.value, files)])
                        )
                    }
                }
            }
        }
    }
}




const getModuleFile = (files: Files, modulePath: string) => {
    let moduleName = modulePath.split('./').pop() || ''
    if (!moduleName.includes('.')) {
        const realModuleName = Object.keys(files).filter(key => {
            return key.endsWith('.ts')
                || key.endsWith('.tsx')
                || key.endsWith('.js')
                || key.endsWith('.jsx')
        }).find((key) => {
            return key.split('.').includes(moduleName)
        })
        if (realModuleName) {
            moduleName = realModuleName
        }
    }
    return files[moduleName]
}

const json2Js = (file: File) => {
    const js = `export default ${file.value}`
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

// 引入相当于 在 页面中动态创建 script 脚本
const css2Js = (file: File) => {
    const randomId = new Date().getTime()
    const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}