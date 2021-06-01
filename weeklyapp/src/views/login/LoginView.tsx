import { observer } from 'mobx-react'
import React from 'react'
import {
  ActivityIndicator,
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { appState } from '../../AppState'
import { SafestView, Text } from '../../components'
import { FieldBox } from '../../components/FieldBox'

import { Colors } from '../../Constants'
import { bindActions } from '../../utils/ComponentUtils'
import { view } from '../../utils/View'
import LoginActions from './LoginActions'

const weeklyLogo = require('../../../assets/icons/weekly-logo.svg.png')

export const LoginView = view('LOGIN_VIEW', (props: {}) => {
  const actions = bindActions(appState, LoginActions)

  return (
    <SafestView topColor={Colors.blackDark} load={appState.loadStack}>
      <View style={style.container}>
        <Image source={weeklyLogo} style={style.logo} />
        <FieldBox
          onPress={actions.loginDevice()}
          style={style.button}
          value={
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text>Sign in with device</Text>
            </View>
          }
        />
      </View>
    </SafestView>
  )
})

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackDark,
  },
  logo: {
    marginLeft: 20,
    width: 300 / 4,
    height: 232 / 4,
    marginBottom: 50,
    opacity: 0.8,
  },
  button: {
    marginTop: 20,
    width: '90%',
  },
})
