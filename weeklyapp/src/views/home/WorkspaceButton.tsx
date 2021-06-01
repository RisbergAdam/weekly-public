import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FieldBox } from '../../components/FieldBox'
import { Text } from '../../components/Text'
import { Colors } from '../../Constants'
import { Workspace } from '../../domain/Workspace'

interface IProps {
  workspace: Workspace
  onPress?: () => any
}

export const WorkspaceButton = (props: IProps) => {
  const { workspace, onPress } = props

  const color = '#8FF1D4'

  return (
    <FieldBox
      onPress={onPress}
      style={{ height: '100%' }}
      tint="green"
      value={
        <>
          <Text style={{ color }}>{workspace.name}</Text>
          <View style={{ height: 5 }} />
          <Text size={12} opacity={0.55} style={{ color }}>
            {workspace.currentUsers}/{workspace.maxUsers} online
          </Text>
        </>
      }
    />
  )
}
