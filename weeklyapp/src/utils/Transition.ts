import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  EasingFunction,
  LayoutAnimation,
  LayoutAnimationConfig,
} from 'react-native'

class Transition {
  private animatedValue: Animated.Value
  private currentValue: number
  private duration: number
  private easing: EasingFunction

  constructor(initialValue: number, duration: number, easing = Easing.ease) {
    this.currentValue = initialValue
    this.duration = duration
    this.animatedValue = new Animated.Value(this.currentValue)
    this.easing = easing
  }

  public transition(nextValue: number): Animated.Value {
    if (nextValue !== this.currentValue) {
      const animOpts = {
        toValue: nextValue,
        duration: this.duration,
        easing: this.easing,
        useNativeDriver: false,
      }
      Animated.timing(this.animatedValue, animOpts).start()
      this.currentValue = nextValue
    }

    return this.animatedValue
  }

  public setValue(value: number) {
    this.currentValue = value
    this.animatedValue.setValue(value)
  }
}

const useTransition = (
  value: number,
  opts?: Partial<Animated.TimingAnimationConfig>,
): [Animated.Value, boolean] => {
  const mounted = useRef(false)
  const prevValue = useRef(value)
  const fastIsAnimating = useRef(false)

  const animated = useMemo(() => new Animated.Value(value), [])
  const [isAnimating, setAnimating] = useState(false)

  useEffect(() => {
    if (mounted.current) {
      animated.setValue(prevValue.current)
      prevValue.current = value
      setAnimating(true)

      Animated.timing(animated, {
        easing: Easing.ease,
        useNativeDriver: true,
        toValue: value,
        ...opts,
        duration: opts?.duration ?? 80,
        delay: opts?.delay ?? 0,
      }).start(() => {
        if (mounted.current) setAnimating(false)
      })
    }
  }, [value])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  if (value !== prevValue.current) {
    fastIsAnimating.current = true
  } else {
    fastIsAnimating.current = false
  }

  return [animated, isAnimating || fastIsAnimating.current]
}

let animationEnabled = true

const animateNext = (config?: LayoutAnimationConfig) => {
  if (animationEnabled) {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 140,
      ...config,
    })
  }
}

const withoutAnimation = (body: () => void) => {
  animationEnabled = false
  try {
    body()
  } catch (error) {
    animationEnabled = true
    throw error
  }
  animationEnabled = true
}

export { Transition, animateNext, withoutAnimation, useTransition }
