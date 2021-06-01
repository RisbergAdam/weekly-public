import React from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { DragHandle } from '../../components/icons'
import { Check } from '../../components/icons/Check'
import { Text } from '../../components/Text'
import { ItemState, ListItem } from '../../domain/ListItem'
import { Product } from '../../domain/Product'
import { IdMap } from '../../domain/Types'
import { Slop10 } from '../../utils/ComponentUtils'
import { useTransition } from '../../utils/Transition'
import * as C from './../../Constants'

const checkIcon = require('../../../assets/icons/check.svg.png')

interface IProps {
  item: ListItem
  isCheckMode?: boolean
  onPress?: () => any
  onDrag?: () => any
  isActive?: boolean
  products: IdMap<Product>
}

export const ListItemView = (props: IProps) => {
  const { item, isCheckMode, onPress, onDrag, isActive, products } = props

  const isChecked = item.state === ItemState.Checked
  const isCircle = !isChecked && isCheckMode

  const [statusOpacity] = useTransition(isCircle ? 1 : 0)
  const [checkOpacity] = useTransition(isChecked ? 0.15 : 0)

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <Animated.View style={{ ...s.container, ...(isActive && s.active) }}>
        <Animated.View
          style={{
            ...s.statusIcon,
            opacity: statusOpacity,
          }}
        />
        <Animated.View
          style={{
            ...s.checkIcon,
            opacity: checkOpacity,
          }}>
          <Check />
        </Animated.View>

        <Text
          bold={true}
          size={14}
          style={{ ...s.productName, opacity: isChecked ? 0.3 : 1 }}>
          {(products[item.product!] || { name: '-' }).name}
        </Text>
        <Text size={11} opacity={0.55}>
          {item.quantity}
        </Text>

        <View style={{ flex: 1 }} />

        {onDrag && (
          <View style={{ opacity: isCheckMode ? 0 : 1 }}>
            <TouchableOpacity
              onPressIn={onDrag}
              disabled={isCheckMode}
              hitSlop={Slop10}>
              <DragHandle style={{ opacity: 0.6, marginRight: C.GutterSize }} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  container: {
    // width: '100%',
    backgroundColor: C.Colors.blackLight,
    borderWidth: 1,
    borderColor: C.Colors.blackBorder,
    marginBottom: -1,
    marginTop: -1,
    marginHorizontal: C.GutterSize,
    borderRadius: 3,
    height: 50,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  active: {
    // backgroundColor: '#36374B',
    ...C.Shadow,
  },
  statusIcon: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: C.Colors.blackBorder,
    marginLeft: 6,
  },
  checkIcon: {
    width: 12,
    //height: 12,
    borderRadius: 10,
    marginLeft: -16,
  },
  checkImage: {
    marginLeft: -4,
    marginTop: -4,
    width: 20,
    height: 20,
  },
  productName: {
    marginRight: 12,
    marginLeft: C.GutterSize,
  },
})
