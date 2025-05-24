import React from "react";

class ClassCom extends React.Component {
    render(): React.ReactNode {
        console.log('render-----class')

        return <button onClick={this.onClick}>这是类组件</button>
    }

    onClick = () => {
        this.props.updateCount()
        setTimeout(() => {
            console.log(this.props.count)
        }, 1000);
    }
}


function FuncCom(props) {
    console.log('render-----func')
    const onClick = () => {
        props.updateCount()
        setTimeout(() => {
            console.log(props.count)
        }, 1000);
    }
    return <button onClick={onClick}>这是函数组件</button>
}


export class FuncComVsClassCOm extends React.Component {
    state = { count: 0 }

    updateCount = () => {
        this.setState((prevState) => {
            return {
                count: prevState.count + 1
            }
        })
    }
    render(): React.ReactNode {
        return (
            <>
                <input />
                <FuncCom count={this.state.count} updateCount={this.updateCount} />
                <ClassCom count={this.state.count} updateCount={this.updateCount} />
            </>
        )
    }
}