import { observer } from 'mobx-react'
import React, { Component, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import * as C from '../../Constants'
import { Button, Icon, InputField, Text } from '../../components'
import { AppState } from '../../AppState'
import { Box } from '../../utils/Box'
import { FieldTitle } from '../../components/FieldBox'
import { UserBox } from './UserBox'
import { SettingsStore } from './SettingsStore'
import { LeaveModal } from './LeaveModal'
import { InviteModal } from './InviteModal'
import { DeleteModal } from './DeleteModal'
import { Navigation } from '../../utils/ComponentUtils'
import { ArrowBack, Delete, PersonAdd } from '../../components/icons'

const Separator = () => <View style={{ width: C.SmallGutter }} />

interface IProps {
  state: AppState
}

export const SettingsView = observer((props: IProps) => {
  const { state } = props
  const store = state.settings

  const { user } = state
  const workspace = state.currentWorkspace

  if (!user || !workspace) return <></>

  let isAdmin = workspace.members.find((u) => u.id == user.id)!!.admin
  const admins = workspace.members.filter((m) => m.admin)
  const users = workspace.members.filter((m) => !m.admin)

  return (
    <ScrollView style={style.scroll} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={style.container}>
        <InputField
          name="Workspace name"
          value={store.workspaceName}
          disabled={!isAdmin}
        />

        {admins.length > 0 && (
          <>
            <FieldTitle value="Admins" />

            <View style={style.users}>
              {admins.map((u) => (
                <UserBox key={u.id} user={u} />
              ))}
            </View>
          </>
        )}

        {users.length > 0 && (
          <>
            <FieldTitle value="Members" />

            <View style={style.users}>
              {users.map((u) => (
                <UserBox key={u.id} user={u} />
              ))}
            </View>
          </>
        )}

        <View style={{ flex: 1 }} />

        <View style={style.buttons}>
          <Button
            icon={<PersonAdd />}
            text="Invite"
            containerStyle={{ flex: 1 }}
            onPress={store.createInvite(state, workspace.id)}
            disabled={!isAdmin}
          />
          <Separator />
          <Button
            icon={<ArrowBack />}
            text="Leave"
            containerStyle={{ flex: 1 }}
            onPress={store.toggleLeaveModal}
          />
          {/* <Button
            icon={<Delete />}
            text="Delete"
            containerStyle={{ flex: 1 }}
            onPress={store.toggleDeleteModal}
            disabled={!isAdmin}
          /> */}
        </View>

        <View style={style.buttons}>
          <Button
            text="Save changes"
            containerStyle={{ width: '100%' }}
            onPress={store.save(state, workspace.id)}
            disabled={!isAdmin || !store.canSave(workspace)}
          />
        </View>

        <InviteModal
          invitation={store.invitation!!}
          copyCode={store.copyCode}
          show={store.showInviteModal}
          close={store.toggleInviteModal}
        />

        <LeaveModal
          workspace={workspace}
          show={store.showLeaveModal}
          leave={store.leaveWorkspace(state, workspace.id)}
          cancel={store.toggleLeaveModal}
        />

        <DeleteModal show={store.showDeleteModal} />
      </View>
    </ScrollView>
  )
})

const style = StyleSheet.create({
  scroll: {
    height: '100%',
    width: '100%',
  },
  container: {
    height: '100%',
    width: '100%',
    padding: C.GutterSize,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -C.SmallGutter / 2,
    marginRight: -C.SmallGutter / 2,
  },
  buttons: {
    marginTop: C.SmallGutter,
    flexDirection: 'row',
  },
})
