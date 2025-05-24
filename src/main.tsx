import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import BabelStandalone from './example/babel-standalone.tsx'
import MonacoEditor from './example/MonacoEditor.tsx'
import { FuncComVsClassCOm } from './example/LowCodeTest.tsx'

createRoot(document.getElementById('root')!).render(
    <>
        {/* <App /> */}
        {/* <BabelStandalone /> */}

        {/* <MonacoEditor /> */}

        <FuncComVsClassCOm />
    </>
)
