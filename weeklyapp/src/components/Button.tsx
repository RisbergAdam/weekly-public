import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import * as C from '../Constants'
import { Text } from './Text'

interface IProps {
  text: string
  icon?: JSX.Element
  onPress: () => any
  style?: any
  containerStyle?: any
  disabled?: boolean
}

@observer
class Button extends Component<IProps> {
  public render() {
    const {
      text,
      icon,
      onPress,
      style: propStyle,
      containerStyle,
      disabled,
    } = this.props

    const enabledBackground = C.Colors.blackLight
    const disabledBackground = C.Colors.blackDark

    const buttonStyle = {
      ...style.button,
      ...(disabled && style.disabled),
      backgroundColor: disabled ? disabledBackground : enabledBackground,
      ...propStyle,
    }

    const textStyle = {
      ...(disabled && { opacity: 0.3 }),
    }

    const iconStyle = {
      ...style.icon,
      ...(disabled && { opacity: 0.2 }),
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        style={containerStyle}
        disabled={disabled}>
        <Animated.View style={buttonStyle}>
          {icon && <View style={iconStyle}>{icon}</View>}
          <Text size={14} opacity={0.85} style={textStyle}>
            {text}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 55,
    width: '100%',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.Colors.blackBorder,
    ...C.Shadow,
  },
  icon: {
    paddingRight: 8,
    opacity: 0.7,
  },
  dark: {},
  disabled: {
    backgroundColor: 'red',
    shadowOpacity: 0,
  },
})

export { Button }
