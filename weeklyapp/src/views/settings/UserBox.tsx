import React from 'react'
import { StyleSheet, View } from 'react-native'

import * as C from './../../Constants'
import { WorkspaceMember } from '../../domain/Workspace'
import { Text } from '../../components'
import { UserIndicator } from '../home/UserIndicator'

interface IProps {
  user: WorkspaceMember
}

export const UserBox = (props: IProps) => {
  const { user } = props

  return (
    <View style={style.container}>
      <View style={style.box}>
        <UserIndicator user={user} />
        <View style={{ width: 5 }} />
        <Text
          opacity={0.6}
          style={style.text}
          options={{
            numberOfLines: 1,
          }}>
          {user.firstName} {user.lastName}
        </Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: '50%',
    height: 52,
    paddingLeft: C.SmallGutter / 2,
    paddingRight: C.SmallGutter / 2,
    paddingBottom: C.SmallGutter,
  },
  box: {
    borderWidth: 1,
    borderColor: C.Colors.blackBorder,
    borderRadius: 3,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
})
