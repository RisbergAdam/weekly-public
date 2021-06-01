import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../../Constants'

export const ArrowBack = (props: any) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={props?.style?.color ?? Colors.text}
    />
  </Svg>
)
