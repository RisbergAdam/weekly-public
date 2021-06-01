import React from 'react'
import { StyleSheet, View } from 'react-native'
import { appState } from '../../AppState'

import { OverlayContainer, SafestView, SlideScreens } from '../../components'
import { MountFade } from '../../components/FadeView'
import * as C from '../../Constants'
import { WorkView } from '../../domain/Workspace'
import { bindActions } from '../../utils/ComponentUtils'
import { view } from '../../utils/View'
import { CalendarView } from '../calendar/CalendarView'
import { ChecklistView } from '../checklist/ChecklistView'
import { RecipesView } from '../recipes/RecipesView'
import { SettingsView } from '../settings/SettingsView'
import HomeActions from './HomeActions'
import { NavigationFooter } from './NavigationFooter'
import { WorkspaceHeader } from './WorkspaceHeader'

export const WorkspaceView = view('WORKSPACE_VIEW', () => {
  const state = appState
  const actions = bindActions(appState, HomeActions)

  let screenIndex = 0
  const currentView = state.currentWorkView
  if (currentView === WorkView.Checklist) {
    screenIndex = 0
  }
  if (currentView === WorkView.Settings) {
    screenIndex = 1
  }
  if (currentView === WorkView.Recipes) {
    screenIndex = 2
  }
  if (currentView === WorkView.Calendar) {
    screenIndex = 3
  }

  return (
    <>
      <SafestView
        load={state.loadStack}
        bottomColor={C.Colors.blackLight}
        style={{ backgroundColor: C.Colors.blackDark }}>
        <WorkspaceHeader
          workspace={state.currentWorkspace!!}
          exitWorkspace={actions.exitWorkspace()}
          isConnected={state.isShareLinkConnected}
          users={state.workspaceShared.users}
        />

        <OverlayContainer name="overlay">
          <MountFade style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: C.Colors.blackDark,
                overflow: 'hidden',
              }}>
              <>
                <SlideScreens currentScreen={screenIndex}>
                  <ChecklistView state={state} />
                  <SettingsView state={state} />
                  <RecipesView />
                  <CalendarView />
                </SlideScreens>
              </>
            </View>
          </MountFade>
          <View
            style={{ borderTopWidth: 1, borderColor: C.Colors.blackBorder }}>
            {state.showToolbar && (
              <NavigationFooter
                currentView={state.currentWorkView}
                setWorkView={actions.setWorkView}
              />
            )}
          </View>
        </OverlayContainer>
      </SafestView>
    </>
  )
})

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})
