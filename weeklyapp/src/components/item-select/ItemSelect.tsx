import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import {
  Alert,
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import * as C from '../../Constants'
import { Id } from '../../domain/Types'
import { animateNext } from '../../utils/Transition'
import { FieldBox, FieldTitle } from '../FieldBox'
import { Text } from '../Text'

interface IProps {
  name?: string
  value?: string
  placeholder?: string
  closeOnSelect?: boolean
  isOpen?: boolean
  onPress?: (open: boolean) => any

  children: JSX.Element
}

@observer
class ItemSelect extends Component<IProps> {
  public componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.closeSelectScreen)
  }

  public componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.closeSelectScreen)
  }

  private closeSelectScreen = () => {
    if (this.props.isOpen) {
      Keyboard.dismiss()
      this.props.onPress?.(false)
      return true
    }
    return false
  }

  private interceptClose = (action?: (_: any) => any) => (value: any) => {
    this.closeSelectScreen()
    if (action) {
      action(value)
    }
  }

  public render() {
    const {
      name,
      children,
      value,
      placeholder,
      closeOnSelect = true,
      onPress,
    } = this.props

    const { onSelect, onAdd } = children.props

    return (
      <View>
        {name && <FieldTitle value={name} />}

        <FieldBox
          value={value}
          placeholder={placeholder}
          onPress={() => {
            onPress?.(true)
          }}
        />

        {true &&
          React.cloneElement(children, {
            onSelect: closeOnSelect ? this.interceptClose(onSelect) : onSelect,
            onAdd: this.interceptClose(onAdd),
          })}
      </View>
    )
  }
}

export { ItemSelect }
