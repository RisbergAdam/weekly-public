import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../../Constants'

export const List = (props: any) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
        fill={props.style?.color ?? Colors.text}
      />
      <Path d="M0 0h24v24H0z" fill="none" />
    </Svg>
  )
}
