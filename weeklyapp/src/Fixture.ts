import { AppState } from './AppState'
import { ProductCategory } from './domain/ProductCategory'
import { User } from './domain/User'
import { Workspace, WorkView } from './domain/Workspace'
import { WorkspaceLocalState } from './WorkspaceLocalState'
import { WorkspaceSharedState } from './WorkspaceSharedState'
import { SettingsStore } from './views/settings/SettingsStore'
import { ItemState } from './domain/ListItem'

function loadFixture(appState: AppState) {
  loadUser(appState)
  loadWorkspace(appState)
  loadProducts(appState)
  appState.currentWorkView = WorkView.Checklist
  appState.workspaceLocal.editingItem = true
  appState.workspaceLocal.editingItemId = 0
  // appState.loadStack.push()
  // appState.showJoinWorkspaceModal = true
}

function loadUser(state: AppState) {
  state.user = new User()
  state.user.id = 0
  state.user.firstName = 'adam'
  state.user.lastName = 'risberg'
  state.user.username = 'adamrisberg'
}

const document = {
  on() {},
  submitOp() {},
  destroy() {},
}

function loadWorkspace(state: AppState) {
  const workspace = new Workspace()
  workspace.id = -1
  workspace.name = 'Testspace'
  workspace.currentUsers = 1
  workspace.maxUsers = 3

  state.workspaces = [workspace, { ...workspace, currentUsers: 0 }, workspace]
  state.workspaces = state.workspaces.map((w, i) => ({ ...w, id: i }))

  let members: any[] = [
    { firstName: 'Adam', lastName: 'Risberg' },
    { firstName: 'Hamm', lastName: 'Bürger' },
    { firstName: 'Boltok', lastName: 'Pistol' },
  ]
  //members = members.concat(members).concat(members).concat(members).concat(members).concat(members);

  members = members.map((u, i) => ({ ...u, id: i, admin: false }))

  members[0].admin = true

  state.currentWorkspace = { ...state.workspaces[0], members }
  state.settings = new SettingsStore(state.currentWorkspace)
  state.settings.invitation = {
    id: 0,
    workspace: state.currentWorkspace.id,
    code: 'ABC123',
    singleUse: false,
    validUntil: new Date(),
  }

  state.workspaceShared = new WorkspaceSharedState(document as any)
  state.workspaceLocal = new WorkspaceLocalState()
  state.isShareLinkConnected = true

  state.workspaceShared.users = {
    1: members[0],
    2: members[1],
  }

  state.workspaceShared.listItems = [
    {
      id: 0,
      product: 0,
      quantity: '1L',
      state: ItemState.Checked,
    },
    {
      id: 1,
      product: 1,
      quantity: '100g',
      state: ItemState.None,
    },
  ]
}

function loadProducts(state: AppState) {
  const dairy: ProductCategory = {
    id: 1,
    name: 'Diary',
  }

  const meat: ProductCategory = {
    id: 2,
    name: 'Meat',
  }

  const products = [
    pr(0, 'Milk', dairy),
    pr(1, 'Cheese', dairy),
    pr(2, 'Eggs', dairy),
    pr(3, 'Sausage', meat),
    pr(4, 'Bacon', meat),
    pr(5, 'Hamburger', meat),
  ]

  products.forEach((p, i) => (p.id = i))
  products.forEach((p) => (state.productsGlobal[p.id] = p))

  state.categories[dairy.id] = dairy
  state.categories[meat.id] = meat
}

const pr = (id: number, name: string, category: ProductCategory) => ({
  id,
  name,
  category: category.id,
})

export { loadFixture }
