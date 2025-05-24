import { action, makeObservable, observable } from "mobx"

type Status = 0 | 1


let Uid = 0

class ToDoItem {
    id: number
    name: string
    status: 0 | 1


    changeStatus(status: Status) {
        this.status = status
    }

    constructor(name: string) {
        this.id = Uid++
        this.name = name
        this.status = 0

        makeObservable(this, {
            status: observable,
            changeStatus: action
        })
    }
}




export default ToDoItem