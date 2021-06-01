import { Navigation } from 'react-native-navigation'
import uuid from 'uuid/v4'
import { AppState } from '../../AppState'
import { Product } from '../../domain'
import { ItemState, ListItem } from '../../domain/ListItem'
import { Id, IdMapValues } from '../../domain/Types'
import { CheckViewMode } from '../../domain/Workspace'
import { animateNext } from '../../utils/Transition'
import { AddProductView } from './AddProductView'

const toggleCheckMode = (state: AppState) => () => {
  const { workspaceLocal: workspaceLocalState } = state
  const currMode = workspaceLocalState.checkViewMode
  if (currMode === CheckViewMode.CheckItems) {
    workspaceLocalState.checkViewMode = CheckViewMode.AddItems
    state.showToolbar = true
  } else {
    workspaceLocalState.checkViewMode = CheckViewMode.CheckItems
    state.showToolbar = false
  }
}

const pressListItem = ({ workspaceShared, workspaceLocal }: AppState) => (
  item: ListItem,
) => () => {
  if (
    workspaceLocal.checkViewMode === CheckViewMode.CheckItems ||
    workspaceLocal.editingItem
  ) {
    if (item.state === ItemState.Checked) {
      //workspaceShared.setListItemField(itemIndex, ItemState.None)
      workspaceShared.setListItemField(item, 'state', ItemState.None)
    } else if (item.state === ItemState.None) {
      workspaceShared.setListItemField(item, 'state', ItemState.Checked)
    }
  } else {
    workspaceLocal.editingItem = true
    workspaceLocal.editingItemId = item.id
  }
}

const toggleItemChecked = ({ workspaceShared }: AppState) => (
  itemId: Id,
) => () => {
  const currItemIndex = workspaceShared.listItems.findIndex(
    (it) => it.id === itemId,
  )
  if (currItemIndex < 0) {
    return
  }
  const currItem = workspaceShared.listItems[currItemIndex]
}

const setItemQuantity = ({ workspaceShared }: AppState) => (item: ListItem) => (
  quantity: string,
) => {
  workspaceShared.setListItemField(item, 'quantity', quantity)
}

const addListItem = (appState: AppState) => () => (pId: Id) => {
  const { products, workspaceShared } = appState

  const listItem = new ListItem()
  listItem.id = uuid() as any // ???
  listItem.product = products[pId].id

  workspaceShared.addListItem(listItem)
}

const moveListItem = (appState: AppState) => (
  item: ListItem,
  toIndexGroup: number,
) => {
  const { workspaceShared } = appState
  const itemCategory = appState.products[item.product!].category
  const group = workspaceShared.listItems.filter(
    (i) => appState.products[i.product!].category === itemCategory,
  )
  const fromIndex = workspaceShared.listItems.findIndex((i) => i.id === item.id)
  const toIndex = workspaceShared.listItems.findIndex(
    (i) => i.id === group[toIndexGroup].id,
  )

  appState.workspaceShared.moveListItem(fromIndex, toIndex)
}

const clearCheckedItems = ({ workspaceShared }: AppState) => () => {
  workspaceShared.clearCheckedItems()
}

const addProductView = (state: AppState) => ({
  enterView: (productName: string) => {
    AddProductView.push({ productName })
  },

  exitView: () => {
    if (state.workspaceLocal.choosingCategory) {
      state.workspaceLocal.choosingCategory = false
    } else {
      AddProductView.pop()
    }
  },

  createProduct: () => {
    const workspace = state.workspaceLocal
    const productName = workspace.createProductName.value ?? ''
    const category = workspace.createProductCategory.value

    if (category === undefined || productName.length === 0) return

    const product = new Product()
    product.id = uuid() as any
    product.name = productName
    product.category = category.id

    state.workspaceShared.addCustomProduct(product)

    const listItem = new ListItem()
    listItem.id = uuid() as any
    listItem.product = product.id

    state.workspaceShared.addListItem(listItem)

    addProductView(state).exitView()
  },

  openCategoryModal: (open: boolean) => {
    animateNext()
    state.workspaceLocal.choosingCategory = open
  },
})

export default {
  toggleCheckMode,
  toggleItemChecked,
  addListItem,
  clearCheckedItems,
  addProductView,
  moveListItem,
  pressListItem,
  setItemQuantity,
}
