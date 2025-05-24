import { useEffect, useReducer } from "react"

// useRedurce 拿到最新的 props
function DispatchDemo(props) {
    function reducer(value) {
        return props.step + value
    }

    const [value, dispatch] = useReducer(reducer, 0)

    useEffect(() => {
        // react 会让 dispatch 在组件的每次渲染中保持 唯一的引用，所以不必再出现在 effect 的依赖中
        document.body.addEventListener('click', dispatch)
        return () => {
            document.body.removeEventListener('click', dispatch)
        }
    }, [])
    // 这里的 依赖为空

    return <div>
        {
            value
        }
    </div>
}

export default DispatchDemo