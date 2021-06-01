import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { asOverlay } from '../../utils/ComponentUtils'
import { SafestView, Text } from '../../components'
import * as C from '../../Constants'
import { WorkspaceButton } from '../home/WorkspaceButton'
import { ConfirmButtons } from '../../components/ConfirmButtons'
import { WorkspaceDetails } from '../../domain/Workspace'

interface IProps {
  leave: () => any
  cancel: () => any
  workspace: WorkspaceDetails
}

export const LeaveModal = asOverlay((props: IProps) => {
  const { leave, cancel, workspace } = props

  const isLast = workspace.members.length === 1

  return (
    <SafestView bottomColor={C.Colors.blackLight} style={style.container}>
      <Text center style={{ width: 250 }}>
        Are you sure you want to <Text bold>leave</Text> the current workspace?
      </Text>
      <View style={{ height: C.GutterSize }} />
      <View style={style.workspaceButton}>
        <WorkspaceButton
          workspace={{
            ...workspace,
            currentUsers: workspace.currentUsers + 1,
          }}
        />
      </View>
      <View style={{ height: C.GutterSize }} />
      {isLast && (
        <Text center style={{ width: 270 }}>
          Since you are the last member to leave, this workspace will also be{' '}
          <Text bold>deleted</Text>.
        </Text>
      )}
      <View style={{ flex: 1 }} />
      <ConfirmButtons
        confirm="Leave workspace"
        cancel="Cancel"
        onConfirm={leave}
        onCancel={cancel}
      />
    </SafestView>
  )
})

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: C.Colors.blackLight,
    padding: C.GutterSize * 2,
  },
  workspaceButton: {
    height: 66 + 6 + 6,
    padding: 6,
    width: 180,
  },
})
