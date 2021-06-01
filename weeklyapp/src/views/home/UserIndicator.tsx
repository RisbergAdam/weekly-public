import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../components/Text'
import * as C from '../../Constants'
import { IWorkspaceUser } from '../../WorkspaceSharedState'

interface IProps {
  large?: boolean
  user: IWorkspaceUser
  online?: boolean
}

@observer
class UserIndicator extends Component<IProps, any> {
  public render() {
    const { user, large, online } = this.props

    const initials =
      (user.firstName || ' ').charAt(0) + (user.lastName || ' ').charAt(0)

    const size = large ? 28 : 20

    const color = online ? '#00D3A3' : C.Colors.text + '88'
    const borderColor = online ? '#00D3A3' : C.Colors.text + '88'

    return (
      <View
        style={{ ...style.indicator, width: size, height: size, borderColor }}>
        <Text size={11} style={{ color }}>
          {initials}
        </Text>
      </View>
    )
  }
}

const style = StyleSheet.create({
  indicator: {
    backgroundColor: C.Colors.blackBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    margin: 3,
    borderWidth: 1,
  },
})

export { UserIndicator }
