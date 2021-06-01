import React from 'react'
import { View } from 'react-native'
import { Colors } from '../Constants'
import { LoadStack } from '../utils/LoadStack'
import { Renderable, renderRenderable } from '../utils/Renderable'
import { CloseIcon } from './CloseIcon'
import { SafestView } from './SafestView'
import { ThinHeader } from './ThinHeader'

interface IProps {
  text?: Renderable
  onClose?: () => any
  children?: any
  style?: any
  load?: LoadStack
}

export const CloseableView = (props: IProps) => {
  const { text = '', onClose = () => {}, children, style, load } = props

  return (
    <SafestView bottomColor={Colors.blackDark} load={load}>
      <ThinHeader
        actionType="close"
        onAction={onClose}
        title={text}></ThinHeader>
      <View style={{ flex: 1, ...style }}>{children}</View>
    </SafestView>
  )
}
