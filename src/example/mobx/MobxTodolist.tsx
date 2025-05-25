import { action, autorun, computed, makeObservable, observable, reaction, runInAction } from "mobx"
import ToDoItem from "./MoboxTodoItem"


function waitTime() {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1000);
    })
}


class ToDoList {
    searchStatus?: 0 | 1
    list: ToDoItem[] = []

    // 过滤状态
    get displayList() {
        if (!this.searchStatus) {
            return this.list
        } else {
            return this.list.filter(item => item.status === this.searchStatus)
        }
    }

    changeStatus(searchStatus: | undefined) {
        this.searchStatus = searchStatus
    }

    // push 没有修改引用地址。
    addItem(name: string) {
        this.list.push(new ToDoItem(name))
    }

    async fetchInitData() {
        // 假装延时
        await waitTime()
        runInAction(() => {
            // 这样就修改了引用地址了
            this.list = [new ToDoItem('one'), new ToDoItem('two')]
        })
    }

    constructor() {
        makeObservable(this, {
            searchStatus: observable,   // observable 也可以单独使用，返回一个 proxy 的包装   
            list: observable,
            displayList: computed,
            changeStatus: action,
            addItem: action,
        })
    }
}


const toDoList = new ToDoList()

autorun(() => console.log(toDoList.list.length))
autorun(() => console.log(toDoList.list))


// action 出发更新之后，会出发 autorun 函数里面的回调函数自动执行

setTimeout(() => {
    toDoList.addItem('小明')
}, 1000);

// setTimeout(() => {
//     toDoList.fetchInitData()
// });



autorun(() => {
    if (toDoList.list.length) {
        console.log(toDoList.list[0].status, 'status')   // 会执行两次，第一次是 length 发横变化，第二次是  toDoList.list[0].changeStatus(1)  修改 status
    }
})


reaction(() => toDoList.list.length, () => {
    toDoList.list[0].changeStatus(1)  //修改 status 的值
})




export default ToDoList