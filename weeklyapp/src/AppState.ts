import ShareDb from 'sharedb/lib/client'

import { Product } from './domain/Product'
import { ProductCategory } from './domain/ProductCategory'
import { IdMap } from './domain/Types'
import { User } from './domain/User'
import { Workspace, WorkView, WorkspaceDetails } from './domain/Workspace'
import { Services } from './Services'
import { allObservable } from './utils/Decorators'
import { LoadStack } from './utils/LoadStack'
import { WorkspaceLocalState } from './WorkspaceLocalState'
import { WorkspaceSharedState } from './WorkspaceSharedState'
import { SettingsStore } from './views/settings/SettingsStore'
import { ListItem } from './domain'

@allObservable
class AppState {
  // services

  public services: Services = new Services(this)

  // global state

  public showToolbar: boolean = true

  public user?: User

  public apiToken?: string

  public workspaces: Workspace[] = []

  public categories: IdMap<ProductCategory> = {}

  public productsGlobal: IdMap<Product> = {}

  get products() {
    return { ...this.productsGlobal, ...this.workspaceShared.customProducts }
  }

  public isLoggedIn = () => !!this.user

  public loadStack = new LoadStack()

  // home state

  public isLoadingLogin = false

  public showJoinModal = false

  public joinCodeInvalid = false

  // workspace states

  public currentWorkspace?: WorkspaceDetails = undefined

  public currentWorkView: WorkView = WorkView.Checklist

  public isShareLinkConnected = false

  public workspaceLocal: WorkspaceLocalState = null!

  public workspaceShared: WorkspaceSharedState = null!

  public settings: SettingsStore = null!

  public selectingItem: boolean = false

  public get workspaceGroupedListItems() {
    const { listItems } = this.workspaceShared

    const categories = [
      ...new Set(
        listItems.map((item) => this.products[item.product!]?.category),
      ),
    ]

    categories.sort()

    return categories.map((category) => {
      const group = listItems.filter(
        (item) => this.products[item.product!]?.category === category,
      )
      return {
        category,
        items: group,
      }
    })
  }
}

export const appState = new AppState()

export { AppState }
