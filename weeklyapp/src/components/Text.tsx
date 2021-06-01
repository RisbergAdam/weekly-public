import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleProp, Text as NativeText, TextStyle } from 'react-native'
import * as C from './../Constants'

interface IProps {
  bold?: boolean
  center?: boolean
  size?: number
  children: any
  opacity?: number
  style?: StyleProp<TextStyle>
  options?: any
}

@observer
class Text extends Component<IProps, any> {
  public render() {
    const { size, bold, center, opacity, style, children, options } = this.props

    let textStyle: any = {
      fontFamily: 'Inter UI',
      fontSize: size || 14,
      fontWeight: bold ? '500' : '200',
      opacity: opacity || 1,
      color: C.Colors.text,
    }

    if (style) {
      textStyle = {
        ...(center && { textAlign: 'center' }),
        ...textStyle,
        ...(style as any),
      }
    }

    return (
      <NativeText style={textStyle} {...options}>
        {children}
      </NativeText>
    )
  }
}

export { Text }
