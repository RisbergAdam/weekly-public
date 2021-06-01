import { observer } from 'mobx-react'
import React, { Component } from 'react'
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as C from '../../Constants'
import { Id } from '../../domain/Types'
import { Renderable, renderRenderable } from '../../utils/Renderable'
import { Overlay } from '../Overlay'
import { Separator } from '../Separator'

const AddItemId = -100000

interface Item {
  id: Id
  value: Renderable
}

interface IProps {
  items?: Item[]
  onSelect?: (_: Id) => any
  show?: boolean

  searchText?: string
  onSearchText?: (_: string) => any
  addText?: Renderable
  onAdd?: (_: string) => any
}

@observer
class SelectScreen extends Component<IProps> {
  private renderItem = ({ item }: { item: Item }) => {
    return (
      <>
        <TouchableOpacity onPress={this.selectItem(item.id)}>
          <View style={style.item}>{renderRenderable(item.value)}</View>
        </TouchableOpacity>
        <Separator />
      </>
    )
  }

  private selectItem = (id: Id) => () => {
    const { onSelect, onAdd, searchText } = this.props

    if (id === AddItemId) {
      if (onAdd) {
        onAdd(searchText || '')
      }
    } else if (onSelect) {
      onSelect(id)
    }
  }

  public render() {
    const { searchText, onSearchText, addText, show } = this.props

    let { items = [] } = this.props

    if (addText) {
      items = items.concat([{ id: AddItemId, value: addText }])
    }

    return (
      <Overlay show={show}>
        <View style={style.container}>
          {/*search text field*/}
          {onSearchText && (
            <>
              <TextInput
                style={style.item}
                value={searchText}
                autoFocus={true}
                onChangeText={(v) => {
                  if (onSearchText) {
                    onSearchText(v)
                  }
                }}
              />
              <Separator />
            </>
          )}

          {/*list of items*/}
          <FlatList
            data={items.map((i) => ({ ...i, key: i.id.toString() }))}
            renderItem={this.renderItem}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Overlay>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.Colors.blackLight,
    // padding: C.GutterSize,
  },
  searchText: {},
  item: {
    color: C.Colors.text,
    height: 55,
    backgroundColor: C.Colors.blackLight,
    justifyContent: 'center',
    paddingLeft: C.GutterSize,
  },
})

export { SelectScreen }
