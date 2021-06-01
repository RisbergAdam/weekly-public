import { observer } from 'mobx-react'
import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import { LoadStack } from '../utils/LoadStack'
import * as C from './../Constants'
import { LoadingOverlay } from './LoadingOverlay'

interface IProps {
  children: any
  topColor?: string
  bottomColor?: string
  style?: any
  load?: LoadStack
}

export const SafestView = observer((props: IProps) => {
  const {
    children,
    topColor = C.Colors.blackLight,
    bottomColor = C.Colors.blackDark,
    style,
    load,
  } = props

  return (
    <LoadingOverlay load={load || new LoadStack()}>
      <SafeAreaView style={{ flex: 1, backgroundColor: topColor }}>
        <KeyboardAvoidingView
          enabled={true}
          behavior="padding"
          style={{ flex: 1, ...style }}>
          {children}
          <View
            style={{
              backgroundColor: bottomColor,
              position: 'absolute',
              bottom: -100,
              right: 0,
              left: 0,
              height: 100,
              zIndex: -1000,
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LoadingOverlay>
  )
})
