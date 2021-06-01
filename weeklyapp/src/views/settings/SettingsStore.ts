import { AppState } from '../../AppState'
import { Box } from '../../utils/Box'
import { allObservable } from '../../utils/Decorators'
import { WorkspaceDetails, WorkspaceInvitation } from '../../domain/Workspace'
import { Id } from '../../domain/Types'
import { typedUndefined } from '../../utils/TypeUtils'
import { Clipboard, Alert } from 'react-native'
import { delay } from '../../Constants'
import { WorkspaceView } from '../home/WorkspaceView'

@allObservable
class SettingsStore {
  public workspaceName = new Box('')

  public showInviteModal = false

  public showLeaveModal = false

  public showDeleteModal = false

  public invitation = typedUndefined<WorkspaceInvitation>()

  constructor(workspace: WorkspaceDetails) {
    this.workspaceName.value = workspace.name
  }

  public toggleInviteModal = () =>
    (this.showInviteModal = !this.showInviteModal)

  public toggleLeaveModal = () => (this.showLeaveModal = !this.showLeaveModal)

  public toggleDeleteModal = () =>
    (this.showDeleteModal = !this.showDeleteModal)

  public createInvite = (state: AppState, workspaceId: Id) => async () => {
    if (!this.invitation) {
      state.loadStack.push()
      this.invitation = await state.services.api.createInvitation(workspaceId)
      state.loadStack.pop()
      await delay(100)
    }
    this.showInviteModal = true
  }

  public copyCode = () => {
    Clipboard.setString(this.invitation!!.code)
  }

  public leaveWorkspace = (state: AppState, workspaceId: Id) => async () => {
    state.loadStack.push()
    await state.services.api.leaveWorkspace(workspaceId)
    state.workspaces = await state.services.api.getWorkspaces()
    state.loadStack.pop()
    WorkspaceView.pop()
  }

  public save = (state: AppState, workspaceId: Id) => async () => {
    state.loadStack.push()
    await state.services.api.patchWorkspace(
      workspaceId,
      this.workspaceName.value,
    )
    const workspacesPromise = state.services.api.getWorkspaces()
    const workspacePromise = state.services.api.getWorkspace(workspaceId)
    state.workspaces = await workspacesPromise
    state.currentWorkspace = await workspacePromise
    state.loadStack.pop()
  }

  public canSave = (workspace: WorkspaceDetails) =>
    workspace.name != this.workspaceName.value
}

export { SettingsStore }
