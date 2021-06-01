import ShareDb from 'sharedb/lib/client'

import { makeAutoObservable } from 'mobx'
import { ItemState, ListItem } from './domain/ListItem'
import { Product } from './domain/Product'
import { Id, IdMap } from './domain/Types'
import { ShareLink } from './services/ShareLink'
import { animateNext, withoutAnimation } from './utils/Transition'

export interface IWorkspaceUser {
  id: number
  firstName: string
  lastName: string
}

class WorkspaceSharedState {
  public listItems: ListItem[] = []

  public clearedListItems: ListItem[] = []

  public customProducts: IdMap<Product> = {}

  public users: IdMap<IWorkspaceUser> = {}

  constructor(private document: ShareDb.Doc) {
    makeAutoObservable(this)
    document.on('op', this.loadData)

    // load initial data
    this.loadData(undefined)
  }

  public static async connect(
    shareLink: ShareLink,
    workspace: Id,
  ): Promise<WorkspaceSharedState> {
    const document = await shareLink.subscribe('workspaces', workspace)

    return new WorkspaceSharedState(document)
  }

  public addCustomProduct(product: Product) {
    this.document.submitOp([{ p: ['customProducts', product.id], oi: product }])
  }

  public setListItemField(
    listItem: ListItem,
    field: keyof ListItem,
    newValue: any,
  ) {
    const oldValue = listItem[field]
    const ix = this.listItems.findIndex((i) => i.id === listItem.id)
    this.document.submitOp([
      { p: ['listItems', ix, field], od: oldValue, oi: newValue },
    ])
  }

  public addListItem(listItem: ListItem) {
    this.document.submitOp([
      { p: ['listItems', this.listItems.length], li: listItem },
    ])
  }

  public clearCheckedItems() {
    const ops: any[] = []

    this.listItems.forEach((li, i) => {
      if (li.state === ItemState.Checked) {
        ops.push(
          { p: ['listItems', i], ld: li },
          { p: ['clearedItems', 0], li },
        )
      }
    })

    ops.reverse()
    this.document.submitOp(ops)
  }

  public moveListItem(fromIndex: number, toIndex: number) {
    withoutAnimation(() => {
      this.document.submitOp([{ p: ['listItems', fromIndex], lm: toIndex }])
    })
  }

  public close() {
    this.document.destroy()
  }

  private loadData = (err: any) => {
    const { data } = this.document

    if (!data) {
      return
    }

    this.listItems = data.listItems
    this.clearedListItems = data.clearedListItems
    this.customProducts = data.customProducts
    this.users = data.users
    animateNext({ duration: 300 })
  }
}

export { WorkspaceSharedState }
