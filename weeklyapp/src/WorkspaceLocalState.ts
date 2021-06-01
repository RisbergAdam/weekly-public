import { observable } from 'mobx'
import { ProductCategory } from './domain'
import { Id } from './domain/Types'
import { CheckViewMode } from './domain/Workspace'
import { Box } from './utils/Box'
import { allObservable } from './utils/Decorators'

@allObservable
class WorkspaceLocalState {
  public checkViewMode = CheckViewMode.AddItems

  public createProductName = new Box<string>()

  public createProductCategory = new Box<ProductCategory>()

  public choosingCategory = false

  public editingItem = false

  public editingItemId?: Id = undefined
}

export { WorkspaceLocalState }
