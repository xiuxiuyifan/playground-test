import { useContext, useEffect, useState } from "react"
import { PlaygroundContext } from "./PlaygroundContext"
import { FileNameItem } from "./FileNameItem"

import styles from './FileNameItem.module.scss'


export default function FileNameList() {

    const {
        files,
        removeFile,
        addFile,
        updateFileName,
        selectedFileName,
        setSelectedFileName
    } = useContext(PlaygroundContext)

    const [tabs, setTabs] = useState([''])

    // 根据 files 计算出文件名列表
    useEffect(() => {
        setTabs(Object.keys(files))
    }, [files])

    return <div className={styles.tabs}>
        {
            tabs.map((item, index) => (
                // 子组件只用显示
                <FileNameItem
                    key={item + index}
                    value={item}
                    actived={selectedFileName === item}
                    onClick={() => setSelectedFileName(item)}  // 设置当前选中的那个文件
                ></FileNameItem>
            ))
        }
    </div>
}