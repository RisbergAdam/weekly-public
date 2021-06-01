import React from 'react'
import { StyleSheet, View } from 'react-native'
import { appState } from '../../AppState'

import { Button, CloseableView, InputField } from '../../components'
import * as C from '../../Constants'
import { useBox } from '../../utils/Box'
import { bindActions } from '../../utils/ComponentUtils'
import { view } from '../../utils/View'
import HomeActions from './HomeActions'

const CreateWorkspaceView = view('CREATE_WORKSPACE_VIEW', (props: {}) => {
  const state = appState
  const actions = bindActions(state, HomeActions)
  const name = useBox('')

  return (
    <CloseableView
      text="Create workspace"
      onClose={CreateWorkspaceView.pop}
      style={style.container}
      load={state.loadStack}>
      <InputField name="Workspace name" value={name} />

      <View style={{ flex: 1 }} />

      <Button
        style={{ width: '100%' }}
        text="Create workspace"
        onPress={actions.createWorkspace({ name })}
        dark={true}
      />
    </CloseableView>
  )
})

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: C.GutterSize,
    backgroundColor: C.Colors.blackDark,
  },
})

export { CreateWorkspaceView }
