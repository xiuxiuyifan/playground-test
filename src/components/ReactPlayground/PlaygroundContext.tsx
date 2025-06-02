// 多个组件 共享一份数据、fileNamelist Editor preview

import { createContext, useState, type PropsWithChildren } from "react";
import { fileName2Language } from "../../utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  value: string;
  language: string;
}

export interface Files {
  [key: string]: File;
}

export interface PlaygroundContext {
  // 存储所有文件
  files: Files;
  // 当前选中的文件名
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFileName: string, newFileName: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type Theme = "light" | "dark";

// 初始化  全局数据
export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;
  // 存放当前编辑器产生的文件，在内存中
  const [files, setFiles] = useState<Files>(initFiles);
  // 当前选中文件名
  const [selectedFileName, setSelectedFileName] = useState("App.tsx");

  const [theme, setTheme] = useState<Theme>("light");

  //
  const addFile = (name: string) => {
    files[name] = {
      name,
      language: fileName2Language(name),
      value: "",
    };
    setFiles({ ...files });
  };

  const removeFile = (name: string) => {
    delete files[name];
    setFiles({ ...files });
  };

  const updateFileName = (oldFileName: string, newFileName: string) => {
    if (
      !files[oldFileName] ||
      newFileName === undefined ||
      newFileName === null
    )
      return;
    const { [oldFileName]: value, ...rest } = files;

    const newFile = {
      [newFileName]: {
        ...value,
        language: fileName2Language(newFileName),
        name: newFileName,
      },
    };
    setFiles({
      ...rest,
      ...newFile,
    });
  };

  return (
    <PlaygroundContext.Provider
      value={{
        files,
        selectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
        setSelectedFileName,
        theme,
        setTheme,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
