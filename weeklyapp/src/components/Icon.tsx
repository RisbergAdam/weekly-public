import React from 'react'
import { Image, StyleSheet } from 'react-native'

const style = StyleSheet.create({
  icon: {
    height: 18,
    width: 18,
    marginLeft: 8,
    marginRight: 8,
  },
})

const createIcon = (source: any) => (props: any) => (
  <Image style={{ ...style.icon, ...props.style }} source={source} />
)

export const assets = {
  Add: require('../../assets/icons/add.svg.png'),
  ArrowBack: require('../../assets/icons/arrow-back.svg.png'),
  ArrowUp: require('../../assets/icons/arrow-up.svg.png'),
  Book: require('../../assets/icons/book.svg.png'),
  Calendar: require('../../assets/icons/calendar.svg.png'),
  CheckCircleWhite: require('../../assets/icons/check-circle-white.svg.png'),
  CheckCircle: require('../../assets/icons/check-circle.svg.png'),
  Check: require('../../assets/icons/check.svg.png'),
  ClearAll: require('../../assets/icons/clear-all.svg.png'),
  Delete: require('../../assets/icons/delete.svg.png'),
  DragHandle: require('../../assets/icons/drag-handle.svg.png'),
  List: require('../../assets/icons/list.svg.png'),
  Settings: require('../../assets/icons/settings.svg.png'),
  PersonAdd: require('../../assets/icons/person-add.svg.png'),
  Key: require('../../assets/icons/key.svg.png'),
  Copy: require('../../assets/icons/copy.svg.png'),
}

export const Icon = {
  Add: createIcon(assets.Add),
  ArrowBack: createIcon(assets.ArrowBack),
  ArrowUp: createIcon(assets.ArrowUp),
  Book: createIcon(assets.Book),
  Calendar: createIcon(assets.Calendar),
  CheckCircleWhite: createIcon(assets.CheckCircleWhite),
  CheckCircle: createIcon(assets.CheckCircle),
  Check: createIcon(assets.Check),
  ClearAll: createIcon(assets.ClearAll),
  Delete: createIcon(assets.Delete),
  DragHandle: createIcon(assets.DragHandle),
  List: createIcon(assets.List),
  Settings: createIcon(assets.Settings),
  PersonAdd: createIcon(assets.PersonAdd),
  Key: createIcon(assets.Key),
  Copy: createIcon(assets.Copy),
}
