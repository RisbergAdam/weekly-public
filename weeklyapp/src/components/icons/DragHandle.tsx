import * as React from 'react'
import Svg, { Defs, Path, ClipPath, Use } from 'react-native-svg'
import { Colors } from '../../Constants'

export const DragHandle = (props: any) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Defs>
        <Path id="prefix__a" d="M0 0h24v24H0V0z" />
      </Defs>
      <ClipPath id="prefix__b">
        <Use xlinkHref="#prefix__a" />
      </ClipPath>
      <Path
        clipPath="url(#prefix__b)"
        d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"
        fill={props.style?.color ?? Colors.text}
      />
    </Svg>
  )
}
