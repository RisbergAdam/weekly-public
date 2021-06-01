import { allObservable } from '../utils/Decorators'
import { Product } from './Product'
import { Id, Reference } from './Types'

export enum ItemState {
  None,
  Checked,
  Cleared,
}

@allObservable
class ListItem {
  public id: Id = ''
  public product?: Reference
  public quantity: string = ''
  public state: ItemState = ItemState.None
}

export { ListItem }
