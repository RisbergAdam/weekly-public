import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import * as C from '../Constants'
import { Slop10 } from '../utils/ComponentUtils'
import { Renderable, renderRenderable } from '../utils/Renderable'
import { Text } from './Text'

interface IBoxProps {
  value?: Renderable
  placeholder?: string
  onPress?: () => any
  style?: ViewStyle
  disabled?: boolean
  tint?: 'green' | 'blue' | 'red'
}

export const FieldBox = (props: IBoxProps) => {
  const {
    onPress,
    value,
    placeholder,
    style: propStyle,
    disabled,
    tint,
  } = props

  return (
    <View
      style={{
        ...style.input,
        ...(disabled && style.disabled),
        ...(tint === 'green' && style.greenTint),
        ...propStyle,
      }}>
      <TouchableOpacity
        hitSlop={Slop10}
        disabled={!onPress}
        onPress={() => {
          if (onPress) {
            onPress()
          }
        }}>
        {value && renderRenderable(value)}
        {!value && <Text opacity={0.6}>{placeholder}</Text>}
      </TouchableOpacity>
    </View>
  )
}

interface ITitleProps {
  value: string
}

export const FieldTitle = (props: ITitleProps) => {
  const { value } = props

  return (
    <Text opacity={0.6} style={{ marginBottom: 8 }}>
      {value}
    </Text>
  )
}

const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    backgroundColor: C.Colors.blackLight,
    borderColor: C.Colors.blackBorder,
    width: '100%',
    height: 62,
    marginBottom: C.SmallGutter,
    paddingLeft: 16,
    borderRadius: 3,
    justifyContent: 'center',
    ...C.Shadow,
  },
  greenTint: {
    // 42, 109, 113
    // backgroundColor: '#36787C',
    // borderColor: '#6FBF9F',
    backgroundColor: '#36787C',
    borderColor: '#6FBF9F',
    /*shadowRadius: 10,
    shadowColor: '#129B8B',
    shadowOpacity: 0.2,
    color: 'red',*/
  },
  disabled: {
    backgroundColor: 'transparent',
  },
})
