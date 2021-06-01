import { observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { asOverlay, Slop10 } from '../../utils/ComponentUtils'
import { SafestView, Text, Button, Icon } from '../../components'
import { WorkspaceInvitation } from '../../domain/Workspace'
import * as C from '../../Constants'
import { Copy } from '../../components/icons'

interface IProps {
  show: boolean
  invitation: WorkspaceInvitation
  close: () => any
  copyCode: () => any
}

export const InviteModal = asOverlay(
  observer((props: IProps) => {
    const { invitation, close, copyCode } = props

    return (
      <SafestView
        bottomColor={C.Colors.blackLight}
        topColor={C.Colors.blackLight}
        style={style.container}>
        <Text>Invitation code:</Text>
        <View style={{ height: C.GutterSize }} />
        <TouchableOpacity
          style={style.code}
          hitSlop={Slop10}
          onPress={copyCode}>
          <Text bold size={22}>
            {invitation.code || '¯\\_(ツ)_/¯'}
          </Text>
          <Copy style={{ marginLeft: 10 }} />
        </TouchableOpacity>
        <View style={{ height: C.GutterSize }} />
        <Text center style={{ width: 260, lineHeight: 22 }}>
          Friends and family can use this code to join your workspace. The code
          is valid for 30 minutes.
        </Text>
        <View style={{ flex: 1 }} />
        <Button
          text="Close"
          onPress={close}
          containerStyle={{ width: '100%' }}
        />
      </SafestView>
    )
  }),
)

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: C.GutterSize * 2,
  },
  code: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
