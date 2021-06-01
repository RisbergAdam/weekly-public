import { observer } from 'mobx-react'
import React, { Component } from 'react'
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import * as C from '../Constants'
import { Transition } from '../utils/Transition'
import { Text } from './Text'
import { Slop10 } from '../utils/ComponentUtils'

interface IProps {
  text: string
  icon?: JSX.Element
  onPress: () => any
  style?: any
  active?: any
  slim?: boolean
}

@observer
class ToolButton extends Component<IProps> {
  public background = new Transition(0, 150)

  public render() {
    const { text, icon, onPress, active, style: propStyle, slim } = this.props

    const buttonStyle = {
      ...style.button,
      backgroundColor: active ? C.Colors.blackBorder : C.Colors.blackLight,
      ...(active ? style.activeStyle : {}),
      ...(slim ? style.slim : {}),
      ...propStyle,
    }

    const textStyle = active ? style.activeText : {}

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={active ? 1 : 0.7}
        hitSlop={Slop10}>
        <View style={buttonStyle}>
          {!slim && icon}
          <Text size={11} opacity={active ? 1 : 1} style={textStyle}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  button: {
    height: 48,
    width: 88,
    backgroundColor: C.Colors.blackLight,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.Colors.blackBorder,
    ...C.Shadow,
  },
  activeText: {
    color: 'white',
  },
  activeStyle: {
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 0,
  },
  slim: {
    height: 28,
  },
})

export { ToolButton }
