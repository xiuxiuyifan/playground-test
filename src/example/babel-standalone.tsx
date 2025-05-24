import type { PluginObj } from '@babel/core';
import { transform } from '@babel/standalone'


// 把当前 文件 import 的文件 './add.ts'  替换成为 blob 创建的 Url
// 在语法树里面进行转换

function BabelStandalone() {
    const code1 = `
    function add(a, b) {
        return a + b;
    }
    export { add };
    `;

    const url = URL.createObjectURL(new Blob([code1], { type: 'application/javascript' }));

    // 创建一个 babel 的插件
    const transformImportSourcePlugin: PluginObj = {
        visitor: {
            ImportDeclaration(path) {
                path.node.source.value = url
            }
        }
    }

    const code = `import {add} from './add.ts'; console.log(add(2,3))`

    function onClick() {
        const res = transform(code, {
            presets: ['react', 'typescript'],
            filename: 'guang.ts',
            plugins: [transformImportSourcePlugin]
        })

        console.log(res.code)
    }

    return (
        <div>
            <button onClick={onClick}>编译</button>
        </div>
    )
}

export default BabelStandalone