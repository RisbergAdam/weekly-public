import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ArrowBack } from '../../components/icons/ArrowBack'
import { Text } from '../../components/Text'
import { ThinHeader } from '../../components/ThinHeader'
import { IdMap, IdMapValues } from '../../domain/Types'
import { Workspace } from '../../domain/Workspace'
import { Slop10 } from '../../utils/ComponentUtils'
import { IWorkspaceUser } from '../../WorkspaceSharedState'
import * as C from './../../Constants'
import { UserIndicator } from './UserIndicator'

const backIcon = require('../../../assets/icons/arrow-back.svg.png')

interface IProps {
  workspace: Workspace
  exitWorkspace: () => any
  isConnected: boolean
  users: IdMap<IWorkspaceUser>
}

@observer
class WorkspaceHeader extends Component<IProps, any> {
  public render() {
    const { exitWorkspace, workspace, isConnected, users } = this.props

    const indicatorStyle = {
      ...style.indicatorStyle,
      backgroundColor: isConnected ? '#40b753' : C.BorderColor,
    }

    return (
      <ThinHeader actionType="back" onAction={exitWorkspace}>
        <View style={indicatorStyle} />
        <Text opacity={isConnected ? 1 : 0.4}>
          {workspace && workspace.name}
        </Text>
        <View style={{ flex: 1 }} />
        {IdMapValues(users).map((user) => (
          <UserIndicator key={user.id} user={user} />
        ))}
        <View style={{ width: C.GutterSize }} />
      </ThinHeader>
    )
  }
}

const style = StyleSheet.create({
  back: {
    width: 20,
    height: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  indicatorStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 7,
  },
})

export { WorkspaceHeader }
