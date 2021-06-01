import React from 'react'
import { StyleSheet, View } from 'react-native'
import * as C from '../Constants'

const Separator = () => <View style={style.separator} />

const style = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: C.Colors.blackBorder,
  },
})

export { Separator }
