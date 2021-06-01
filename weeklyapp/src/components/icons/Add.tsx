import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../../Constants'

export function Add(props: any) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Path
        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
        fill={props.style?.color ?? Colors.text}
      />
      <Path d="M0 0h24v24H0z" fill="none" />
    </Svg>
  )
}
