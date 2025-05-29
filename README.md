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



## context 数据结构

```
{
  "App.vue": {
    name: 'App.vue',
    value: '代码内容',
    language: 'vue'
  },
  "Comp.vue": {
    name: 'Comp.vue',
    value: '代码内容',
    language: 'vue'
  }
}
```

PlaygroundProvider  组件把自己自身内部的数据提供出去、


```
<PlaygroundProvider>
  <ReactPlayground />
</PlaygroundProvider>
```

这样就可以在任意组件用 useContext 读取 context 的值了。


在编辑器中展示 file 中当前选中的那一个



### 通过 babel 插件来处理 import 语句，转换成 blob url 的方式。



分别对 css、json 还有 tsx、ts 等后缀名的 import 做下替换：

