import { classDecorator } from 'decorating'
import { makeAutoObservable, makeObservable, observable } from 'mobx'

const allObservable = classDecorator((target: any) => {
  return (...args: any[]) => {
    const store = new target(...args)
    makeAutoObservable(store)
    return store
  }
})
export { allObservable }
