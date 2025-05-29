import classNames from "classnames";
import type React from "react";

import styles from './FileNameItem.module.scss'

import { useState } from "react";

export interface FileNameItemProps {
    value: string
    actived: boolean
    onClick: () => void
}

export const FileNameItem: React.FC<FileNameItemProps> = (props) => {

    const {
        value,
        actived = false,
        onClick
    } = props

    const [name, setName] = useState(value)
    return (
        <div className={classNames(styles['tab-item'], actived ? styles.actived : null)} onClick={onClick}>
            <span>
                {name}
            </span>
        </div>
    )
}