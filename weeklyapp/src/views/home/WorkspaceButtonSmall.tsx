import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../components'
import { FieldBox } from '../../components/FieldBox'
import { Colors } from '../../Constants'

interface IProps {
  onPress?: () => any
  icon: any
  text?: string
}

export const WorkspaceButtonSmall = (props: IProps) => {
  const { onPress, text, icon: Icon } = props
  return (
    <View style={style.margin}>
      <FieldBox
        onPress={onPress}
        style={style.box}
        value={
          <View style={style.button}>
            <Icon style={style.icon} />
            <Text size={11} style={{ textAlign: 'center' }}>
              {text}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const style = StyleSheet.create({
  margin: {
    width: '50%',
    paddingLeft: 2.5,
    paddingRight: 2.5,
  },
  box: {
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
})
