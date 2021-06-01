import { AppState } from '../../AppState'
import { Id } from '../../domain/Types'
import { WorkView } from '../../domain/Workspace'
import { Box } from '../../utils/Box'
import { WorkspaceLocalState } from '../../WorkspaceLocalState'
import { WorkspaceSharedState } from '../../WorkspaceSharedState'
import { CreateWorkspaceView } from './CreateWorkspaceView'
import { SettingsStore } from '../settings/SettingsStore'
import { WorkspaceView } from './WorkspaceView'

const enterWorkspace = (state: AppState) => (workspace: Id) => async () => {
  const { shareLink, api } = state.services

  console.log('enter workspace')
  state.loadStack.push()

  state.workspaceLocal = new WorkspaceLocalState()
  state.currentWorkView = WorkView.Checklist
  state.workspaceShared = await WorkspaceSharedState.connect(
    shareLink,
    workspace,
  )
  state.currentWorkspace = await api.getWorkspace(workspace)
  state.settings = new SettingsStore(state.currentWorkspace)

  state.loadStack.pop()
  WorkspaceView.push({})
}

const exitWorkspace = (state: AppState) => () => () => {
  if (state.selectingItem) {
    state.selectingItem = false
    return
  }

  if (state.settings.showLeaveModal) {
    state.settings.showLeaveModal = false
    return
  }

  if (state.settings.showInviteModal) {
    state.settings.showInviteModal = false
    return
  }

  if (state.settings.showDeleteModal) {
    state.settings.showDeleteModal = false
    return
  }

  if (state.workspaceLocal.editingItem) {
    state.workspaceLocal.editingItem = false
    return
  }

  state.workspaceShared.close()
  WorkspaceView.pop()
  state.currentWorkspace = null!
}

const joinWorkspace = (state: AppState) => (code: Box<string>) => async () => {
  if (code.value === '') {
    state.showJoinModal = false
  }

  state.joinCodeInvalid = false

  state.loadStack.push()
  const response = await state.services.api.joinWorkspace(code.value!)
  state.loadStack.pop()

  if (response.statusCode === 200) {
    state.workspaces.push(response)
    state.showJoinModal = false
  } else if (response.statusCode === 404) {
    state.joinCodeInvalid = true
  } else {
    throw { error: 'unexpected response' }
  }
}

const createWorkspace = (state: AppState) => (conf: {
  name: Box<string>
}) => async () => {
  state.loadStack.push()

  const workspace = await state.services.api.createWorkspace(conf.name.value!)

  state.workspaces.push(workspace)

  state.loadStack.pop()
  CreateWorkspaceView.pop()
}

const refreshWorkspaces = (state: AppState) => async () => {
  const { api } = state.services
  state.workspaces = await api.getWorkspaces()
}

const setWorkView = (appState: AppState) => (view: WorkView) => {
  appState.currentWorkView = view
}

const toggleJoinModal = (state: AppState) => () => {
  state.showJoinModal = !state.showJoinModal
}

const openCreateWorkspaceView = (appState: AppState) => () => () => {
  CreateWorkspaceView.push({})
}

export default {
  enterWorkspace,
  exitWorkspace,
  setWorkView,
  refreshWorkspaces,
  toggleJoinModal,
  openCreateWorkspaceView,
  createWorkspace,
  joinWorkspace,
}
