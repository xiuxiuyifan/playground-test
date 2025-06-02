import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "./PlaygroundContext";
import { FileNameItem } from "./FileNameItem";

import styles from "./FileNameItem.module.scss";
import {
  APP_COMPONENT_FILE_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from "./files";

export default function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);
  const [creating, setCreating] = useState(false);

  // 根据 files 计算出文件名列表
  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  // 点击的时候需要切换状态，编辑完成之后也需要切换状态
  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);
    setCreating(false);
  };

  const addTab = () => {
    addFile("Comp" + Math.random().toString().slice(2, 6) + ".tsx");
    setCreating(true);
  };

  // 子组件调用 父组件的的移除 当前文件的方法
  const handleRemove = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME);
  };

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index, arr) => (
        // 子组件只用显示
        <FileNameItem
          key={item + index}
          value={item}
          actived={selectedFileName === item}
          readonly={readonlyFileNames.includes(item)}
          onClick={() => setSelectedFileName(item)} // 设置当前选中的那个文件
          onEditComplete={(name: string) => handleEditComplete(name, item)}
          creating={creating && index === arr.length - 1}
          onRemove={() => {
            handleRemove(item);
          }}
        ></FileNameItem>
      ))}
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>
  );
}
