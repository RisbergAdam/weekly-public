import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import * as C from '../Constants'
import { Slop10 } from '../utils/ComponentUtils'
import { Renderable, renderRenderable } from '../utils/Renderable'
import { Add, ArrowBack } from './icons'
import { Text } from './Text'

interface IProps {
  large?: boolean
  actionType?: 'back' | 'close'
  onAction?: () => any
  title?: Renderable
  children?: any
  onPress?: () => any
}

export const ThinHeader = observer((props: IProps) => {
  const { large, actionType, title, onAction, children, onPress } = props

  const height = large ? 46 : 38

  return (
    <View style={{ ...style.container, height }}>
      {actionType && (
        <>
          <TouchableOpacity
            onPress={onAction}
            hitSlop={Slop10}
            style={{ paddingRight: C.GutterSize / 2 }}>
            {actionType === 'back' && <ArrowBack />}
            {actionType === 'close' && (
              <Add
                style={{ transform: [{ rotate: '45deg' }, { scale: 1.2 }] }}
              />
            )}
          </TouchableOpacity>
        </>
      )}
      {title && renderRenderable(title)}
      {children}
    </View>
  )
})

const style = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: C.Colors.blackLight,
    borderBottomWidth: 1,
    borderBottomColor: C.Colors.blackBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: C.GutterSize,
    zIndex: 2,
    ...C.Shadow,
  },
  back: {
    color: '#007AFF',
    paddingLeft: 10,
    paddingRight: 10,
  },
})
