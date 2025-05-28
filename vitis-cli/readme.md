## 安装包

将当前脚手架安装为全局的命令

```
npm install -g .
```


再就是 esModuleInterop，这个也是 ts 常用配置。

默认 fs 要这么引入，因为它是 commonjs 的包，没有 default 属性：

```javascript
import * as fs from 'fs';
```
设置 esModuleInterop 会在编译的时候自动加上 default 属性。

就可以这样引入了：

```javascript
import fs from 'fs';
```

## editor actions

```
let actions = editor.getSupportedActions().map((a) => a.id);
    console.log(actions);
```


## 下载第三方包d.ts 声明文件

```
export function createATA(onDownloadFile: (code: string, path: string) => void) {
    const ata = setupTypeAcquisition({
        projectName: 'my-ata',
        typescript: typescriprt,
        logger: console,
        delegate: {
            receivedFile: (code, path) => {
                console.log('自动下载的包', path);
                onDownloadFile(code, path);
            }
        },
    })

    return ata;
}
```