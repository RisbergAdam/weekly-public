import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../../Constants'

export const Delete = (props: any) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
        fill={props.style?.color ?? Colors.text}
      />
      <Path fill="none" d="M0 0h24v24H0V0z" />
    </Svg>
  )
}
