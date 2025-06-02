import classNames from "classnames";
import type React from "react";

import styles from "./FileNameItem.module.scss";

import { useEffect, useRef, useState, type MouseEventHandler } from "react";
import { Popconfirm } from "antd";

export interface FileNameItemProps {
  value: string;
  actived: boolean;
  creating: boolean;
  readonly: boolean;
  onClick: () => void;
  onEditComplete: (value: string) => void;
  onRemove: () => void;
}

export const FileNameItem: React.FC<FileNameItemProps> = (props) => {
  const {
    value,
    actived = false,
    readonly,
    onClick,
    onEditComplete,
    creating,
    onRemove,
  } = props;

  const [name, setName] = useState(value);

  // 用来标记当前文件是否是编辑状态
  const [editing, setEditing] = useState(creating);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputBlur = () => {
    setEditing(false);
    onEditComplete(name); // 修改文件名
  };

  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  return (
    <div
      className={classNames(
        styles["tab-item"],
        actived ? styles.actived : null
      )}
      onClick={onClick}
    >
      {editing ? (
        <input
          ref={inputRef}
          className={styles["tabs-item-input"]}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleInputBlur}
        />
      ) : (
        <>
          <span onDoubleClick={handleDoubleClick}>{name}</span>
          {!readonly ? (
            <Popconfirm
              title="确定删除该文件吗？"
              onConfirm={(e) => {
                e?.stopPropagation();
                onRemove();
              }}
              okText="确定"
              cancelText="取消"
            >
              <span style={{ marginLeft: 5, display: "flex" }}>
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
                  <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </Popconfirm>
          ) : null}
        </>
      )}
    </div>
  );
};
