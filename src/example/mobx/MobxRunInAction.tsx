import { makeAutoObservable, reaction, when, autorun, runInAction } from 'mobx';
class Doubler {
    PI = 3.14
    value
    constructor(value) {
        makeAutoObservable(this, { PI: false }, { autoBind: true })
        this.value = value
    }
    get double() {
        return this.value * 2
    }
    increment() {
        this.value++
        this.value++
    }
    *fetch() {
        const response = yield new Promise((resolve) => setTimeout(() => resolve(5), 1000))
        this.value = response;
    }
}


const doubler = new Doubler(1);
autorun(() => console.log(doubler.value));

runInAction(() => {
    doubler.value++;
    doubler.value++;
    doubler.value++;
});