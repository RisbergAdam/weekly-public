import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native'
import { LoadStack } from '../utils/LoadStack'
import { FadeView } from './FadeView'

interface IProps {
  load: LoadStack
  children: any
  style?: any
}

export const LoadingOverlay = observer((props: IProps) => {
  const { load, children, style: propStyle } = props

  return (
    <FadeView
      show={load.isLoading}
      style={{ width: '100%', flex: 1, ...propStyle }}
      fade={
        <View style={style.loading}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      }>
      {children}
    </FadeView>
  )
})

const style = StyleSheet.create({
  loading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15131AAA',
  },
})
