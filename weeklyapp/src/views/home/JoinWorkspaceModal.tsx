import { observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, InputField, Text } from '../../components'
import { asOverlay, bindActions } from '../../utils/ComponentUtils'
import * as C from '../../Constants'
import { AppState } from '../../AppState'
import { ConfirmButtons } from '../../components/ConfirmButtons'
import HomeActions from './HomeActions'
import { useBox } from '../../utils/Box'

interface IProps {
  state: AppState
  show: boolean
}

const JoinWorkspaceModal = asOverlay(
  observer((props: IProps) => {
    const { state } = props
    const actions = bindActions(state, HomeActions)
    const code = useBox('')

    return (
      <View style={style.container}>
        <InputField
          name="Invitation code"
          value={code}
          textInput={{
            autoFocus: true,
            autoCorrect: false,
            autoCapitalize: 'characters',
          }}
        />

        <View style={{ flex: 1, alignItems: 'center' }}>
          {state.joinCodeInvalid && (
            <>
              {/*placeholder icon*/}
              <Icon.Delete style={{ marginTop: 60 }} />
              <Text bold style={{ margin: 15 }}>
                Invitation not found
              </Text>
              <Text>Check invitation code and try again.</Text>
            </>
          )}
        </View>

        <ConfirmButtons
          confirm="Join workspace"
          cancel="Cancel"
          onConfirm={actions.joinWorkspace(code)}
          onCancel={actions.toggleJoinModal}
        />

        <View
          style={{
            backgroundColor: C.Colors.blackLight,
            position: 'absolute',
            bottom: -100,
            right: 0,
            left: 0,
            height: 100,
            zIndex: -1000,
          }}
        />
      </View>
    )
  }),
)

const style = StyleSheet.create({
  container: {
    backgroundColor: C.Colors.blackLight,
    padding: C.GutterSize * 1.5,
    borderRadius: 3,
    flex: 1,
  },
})

export { JoinWorkspaceModal }
