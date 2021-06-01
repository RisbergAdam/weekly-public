import React, { Component, useEffect, useState } from 'react'
import { Animated, StyleSheet, View, ViewStyle } from 'react-native'
import { useTransition } from '../utils/Transition'

interface IProps {
  mount?: boolean // "mount-fade"
  show: boolean
  style?: any
  fade: any
  children?: any
  // anim opts
  duration?: number
  delay?: number
}

export const FadeView = (props: IProps) => {
  const { children, style, mount, fade, show, duration, delay } = props

  const [mounted, setMounted] = useState(false)
  const [opacity, animating] = useTransition(
    mount && !mounted ? 0 : show ? 1 : 0,
    { duration, delay },
  )

  useEffect(() => {
    setTimeout(() => setMounted(true), 70)
  }, [])

  const fadeStyle = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    opacity: opacity,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
  }

  return (
    <View style={style} pointerEvents="box-none">
      {children}
      {mounted && (animating || show) && (
        <Animated.View style={fadeStyle}>{fade}</Animated.View>
      )}
    </View>
  )
}

export const MountFade = (props: { children: any; style?: ViewStyle }) => (
  <FadeView
    show={true}
    mount={true}
    duration={150}
    style={{
      width: '100%',
      flex: 1,
      ...props.style,
    }}
    fade={props.children}
  />
)
