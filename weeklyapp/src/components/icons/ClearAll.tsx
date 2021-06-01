import * as React from 'react'
import { Colors } from '../../Constants'
import Svg, { Path } from 'react-native-svg'

export const ClearAll = (props: any) => {
  return (
    <Svg width={20} height={22} viewBox="0 1 20 20" {...props}>
      <Path
        fill={props.style?.color ?? Colors.text}
        d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"
      />
      <Path d="M0 0h24v24H0z" fill="none" />
    </Svg>
  )
}
