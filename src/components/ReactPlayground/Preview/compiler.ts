import { transform } from "@babel/standalone";
import type { Files } from "../PlaygroundContext";
import { ENTRY_FILE_NAME } from "../files";
import type { PluginObj } from "@babel/core";

// 在 babel 之前，判断一下文件内容有没有 import React 没有就 import 一下

export const beforeTransformCode = (filename: string, code: string) => {
    let _code = code;
    const regexReact = /import\s+React/g;
    if (
        (filename.endsWith(".jsx") || filename.endsWith(".tsx")) &&
        !regexReact.test(code)
    ) {
        _code = `import React from 'react' \n ${code}`;
    }
    return _code;
};
export const babelTransform = (
    filename: string,
    code: string,
    files: Files
) => {
    const _code = beforeTransformCode(filename, code);

    let result = "";

    try {
        result = transform(_code, {
            presets: ["react", "typescript"],
            filename,
            plugins: [customResolver(files)],
            retainLines: true, // retainLines 是编译后保持原有行列号不变。
        }).code!;
    } catch (error) {
        console.log(error, "编译出错");
    }
    return result;
};

// 要对所有文件都进行编译
export const compile = (files: Files) => {
    // 从入口文件 转换 import 导入
    const main = files[ENTRY_FILE_NAME];
    return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

function customResolver(files: Files): PluginObj {
    return {
        visitor: {
            ImportDeclaration(path) {
                let modulePath = path.node.source.value;
                // 如果是 .开头
                if (modulePath.startsWith(".")) {
                    // 获取  import 文件的 源文件字符串
                    const file = getModuleFile(files, modulePath);
                    if (!file) {
                        return;
                    }
                    // css 文件
                    if (file.name.endsWith(".css")) {
                        path.node.source.value = css2Js(file);
                    }
                    // json 文件
                    else if (file.name.endsWith(".json")) {
                        path.node.source.value = json2Js(file);
                    }
                    // js 文件
                    else {
                        // 如果是 js 文件，则递归调用  babel 进行编译转换
                        // 可以在这里转存一份编译后的代码
                        path.node.source.value = URL.createObjectURL(
                            new Blob([babelTransform(file.name, file.value, files)], {
                                type: "application/javascript",
                            })
                        );
                    }
                }
            },
        },
    };
}

const getModuleFile = (files: Files, modulePath: string) => {
    let moduleName = modulePath.split("./").pop() || "";
    if (!moduleName.includes(".")) {
        const realModuleName = Object.keys(files)
            .filter((key) => {
                return (
                    key.endsWith(".ts") ||
                    key.endsWith(".tsx") ||
                    key.endsWith(".js") ||
                    key.endsWith(".jsx")
                );
            })
            .find((key) => {
                return key.split(".").includes(moduleName);
            });
        if (realModuleName) {
            moduleName = realModuleName;
        }
    }
    return files[moduleName];
};

const json2Js = (file: File) => {
    const js = `export default ${file.value}`;
    return URL.createObjectURL(
        new Blob([js], { type: "application/javascript" })
    );
};

// 引入相当于 在 页面中动态创建 script 脚本
const css2Js = (file: File) => {
    const randomId = new Date().getTime();
    const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `;
    return URL.createObjectURL(
        new Blob([js], { type: "application/javascript" })
    );
};
