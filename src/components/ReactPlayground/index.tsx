import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./Header";
import Preview from "./Preview/Preview";
import CodeEditor from "./CodeEditor";
import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundContext";

import "./index.scss";
export default function ReactPlayground() {
  const { theme, setTheme } = useContext(PlaygroundContext);

  return (
    <div style={{ height: "100vh" }} className={theme}>
      <Header />
      <Allotment defaultSizes={[100, 100]}>
        <Allotment.Pane minSize={0}>
          <CodeEditor />
        </Allotment.Pane>
        <Allotment.Pane minSize={0}>
          <Preview />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
