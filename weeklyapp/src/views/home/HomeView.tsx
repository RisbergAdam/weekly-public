import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SafestView } from '../../components/SafestView'
import { Text } from '../../components/Text'
import * as C from '../../Constants'
import { appState } from '../../AppState'
import { bindActions } from '../../utils/ComponentUtils'
import { view } from '../../utils/View'
import HomeActions from './HomeActions'
import { JoinWorkspaceModal } from './JoinWorkspaceModal'
import { WorkspaceButton } from './WorkspaceButton'
import { WorkspaceButtonSmall } from './WorkspaceButtonSmall'
import { ArrowBack, Add } from '../../components/icons'
import { OverlayContainer, ThinHeader } from '../../components'
import { UserIndicator } from './UserIndicator'
import { MountFade } from '../../components/FadeView'

export const HomeView = view('HOME_VIEW', () => {
  const state = appState
  const actions = bindActions(state, HomeActions)
  const { workspaces } = state

  useState()

  return (
    <SafestView style={s.container} load={state.loadStack}>
      <ThinHeader
        large
        title={
          <>
            <UserIndicator user={state.user!} large online />
            <Text bold style={{ paddingLeft: 10 }}>
              {state.user?.firstName} {state.user?.lastName}
            </Text>
          </>
        }
        onPress={() => {}}
      />
      <MountFade>
        <OverlayContainer name="overlay">
          <JoinWorkspaceModal show={state.showJoinModal} state={state} />
          <>
            <ScrollView style={s.scroll}>
              <Text
                opacity={0.6}
                size={12}
                style={{
                  paddingLeft: 6,
                  paddingBottom: 6,
                }}>
                Workspaces
              </Text>
              <View style={s.list}>
                {workspaces.map((workspace) => (
                  <View key={workspace.id} style={s.button}>
                    <WorkspaceButton
                      workspace={workspace}
                      onPress={actions.enterWorkspace(workspace.id)}
                    />
                  </View>
                ))}

                <View style={{ ...s.button, ...s.smallButtons }}>
                  <WorkspaceButtonSmall
                    text="Join Existing"
                    icon={ArrowBack}
                    onPress={actions.toggleJoinModal}
                  />
                  <WorkspaceButtonSmall
                    text={'Create' + '\n' + 'New'}
                    icon={Add}
                    onPress={actions.openCreateWorkspaceView()}
                  />
                </View>
              </View>
            </ScrollView>
          </>
        </OverlayContainer>
      </MountFade>
    </SafestView>
  )
})

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.Colors.blackDark,
  },
  scroll: {
    backgroundColor: C.Colors.blackDark,
    width: '100%',
    paddingTop: C.GutterSize - 5,
    paddingLeft: C.GutterSize - 5,
    paddingRight: C.GutterSize - 5,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: '50%',
    height: 66 + 6 + 6,
    padding: 6,
  },
  smallButtons: {
    flexDirection: 'row',
    paddingLeft: 4,
    paddingRight: 4,
  },
})
