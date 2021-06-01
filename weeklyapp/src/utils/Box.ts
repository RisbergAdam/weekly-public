import { useRef } from 'react'
import { allObservable } from './Decorators'

@allObservable
export class Box<T> {
  constructor(private innerValue?: T, public onChange?: (value?: T) => any) {}

  get value(): T | undefined {
    return this.innerValue
  }

  set value(v: T | undefined) {
    this.innerValue = v
    this.onChange?.(v)
  }
}

export const useBox = <T>(value: T) => {
  const ref = useRef(new Box(value))
  return ref.current
}

export const boxed = <T>(value: T, change: (value: T) => any): Box<T> => {
  return new Box(value, change as any)
}
