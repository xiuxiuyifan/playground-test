import { useRef, useState } from 'react'
import BabelTransform from './example/BabelTransform'
import BabelStandalone from './example/babel-standalone.tsx'
import { FuncComVsClassCOm } from './example/LowCodeTest.tsx'
import DispatchDemo from './example/DispatchDemo.tsx'
import TimerView from './example/mobx/MobxStudy.tsx'
import { makeAutoObservable } from 'mobx'
import Preview from './components/ReactPlayground/Preview.tsx'
import ReactPlayground from './components/ReactPlayground/index.tsx'
import { PlaygroundProvider } from './components/ReactPlayground/PlaygroundContext.tsx'
// import ToDoList from './example/mobx/MobxTodolist.tsx'
// import './example/mobx/MobxRunInAction.tsx'

function App() {
  const [counter] = useState({ step: 4 })

  // Model the application state.

  function createTimer() {
    return makeAutoObservable({
      secondsPassed: 0,
      increase() {
        this.secondsPassed += 1
      },
      reset() {
        this.secondsPassed = 0
      }
    })
  }

  const myTimer = createTimer()

  // Update the 'Seconds passed: X' text every second.
  setInterval(() => {
    myTimer.increase()
  }, 1000)

  return (
    <>
      {/* babel 转换源代码 */}
      {/* <BabelTransform /> */}

      {/* <BabelStandalone /> */}

      {/* <MonacoEditor /> */}

      {/* <FuncComVsClassCOm /> */}

      {/* <DispatchDemo step={counter.step} /> */}

      {/* <TimerView timer={myTimer} /> */}

      {/* <Preview /> */}
      <PlaygroundProvider>
        <ReactPlayground />
      </PlaygroundProvider>
    </>
  )
}

export default App
