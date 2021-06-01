import { observer } from 'mobx-react'
import React from 'react'
import { TextInput } from 'react-native'
import { Colors } from '../Constants'
import { Box } from '../utils/Box'
import { FieldBox, FieldTitle } from './FieldBox'
import { Text } from './Text'

interface IProps {
  name?: string
  value?: Box<string>
  textInput?: any
  disabled?: boolean
}

export const InputField = observer((props: IProps) => {
  const { name, value = new Box(''), textInput, disabled } = props

  let content = (
    <TextInput
      value={value.value}
      onChangeText={(v) => {
        value.value = v
      }}
      style={{ height: '100%', width: '100%', color: Colors.text }}
      {...textInput}
    />
  )

  if (disabled) {
    content = <Text opacity={0.6}>{value.value}</Text>
  }

  return (
    <>
      {name && <FieldTitle value={name} />}
      <FieldBox value={content} disabled={disabled} />
    </>
  )
})
