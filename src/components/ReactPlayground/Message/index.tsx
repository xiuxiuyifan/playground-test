import classNames from "classnames";
import type React from "react";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

export interface MessageProps {
  type: "error" | "warn";
  content: string;
}

export const Message: React.FC<MessageProps> = (props) => {
  const { type, content } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!content);
  }, [content]);

  return visible ? (
    <div className={classNames(styles.msg, styles[type])}>
      <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
      <button className={styles.dismiss} onClick={() => setVisible(false)}>
        x
      </button>
    </div>
  ) : null;
};
