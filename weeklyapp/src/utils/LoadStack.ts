import { computed, makeAutoObservable, observable } from 'mobx'
import { allObservable } from './Decorators'

@allObservable
export class LoadStack {
  private counter = 0

  public push() {
    this.counter += 1
  }

  public pop() {
    this.counter -= 1
  }

  public get isLoading() {
    return this.counter > 0
  }
}
