import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Animated, StyleSheet, View, Easing } from 'react-native'
import { Transition } from '../utils/Transition'

interface IProps {
  children: JSX.Element[]
  currentScreen: number
  // onFling: (nextScreen: number) => any,
}

@observer
class SlideScreens extends Component<IProps, any> {
  public margin = new Transition(0, 350, Easing.bezier(0.14, 0.04, 0.15, 0.99))

  public render() {
    const { children, currentScreen } = this.props

    const screenCount = children.length
    const minMargin = (screenCount - 1) * -100

    return (
      // <FlingGestureHandler
      //   direction={Directions.LEFT}
      //   onHandlerStateChange={e => {
      //     if (e.nativeEvent.state !== State.ACTIVE) return;
      //     onFling(currentScreen + 1);
      //   }}
      // >
      //   <FlingGestureHandler
      //     direction={Directions.RIGHT}
      //     onHandlerStateChange={e => {
      //       if (e.nativeEvent.state !== State.ACTIVE) return;
      //       onFling(currentScreen - 1);
      //     }}
      //   >
      <Animated.View
        style={{
          flex: 1,
          width: 100 * screenCount + '%',
          // position: "absolute",
          flexDirection: 'row',
          // marginLeft: (currentScreen * -100) + "%",
          marginLeft: this.margin.transition(-currentScreen * 100).interpolate({
            inputRange: [minMargin, 0],
            outputRange: [minMargin + '%', '0%'],
          }),
          // marginLeft: (-currentScreen * 100) + "%"
        }}>
        {children.map((s, i) => (
          <View
            style={{
              width: 100 / screenCount + '%',
              height: '100%',
            }}
            key={i}>
            {s}
          </View>
        ))}
      </Animated.View>
      //   </FlingGestureHandler>
      // </FlingGestureHandler>
    )
  }
}

export { SlideScreens }
