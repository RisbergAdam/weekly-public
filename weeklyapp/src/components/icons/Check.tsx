import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../../Constants'

export const Check = (props: any) => {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
        fill={props?.style?.color ?? Colors.text}
      />
    </Svg>
  )
}
