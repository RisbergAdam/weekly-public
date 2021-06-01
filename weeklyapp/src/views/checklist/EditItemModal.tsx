import { observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AppState } from '../../AppState'
import { Button, InputField, Text } from '../../components'
import { boxed } from '../../utils/Box'
import { asOverlay, bindActions } from '../../utils/ComponentUtils'
import * as C from './../../Constants'
import ChecklistActions from './ChecklistActions'
import { ListItemView } from './ListItemView'

type IProps = {
  state: AppState
  itemId?: number
}

export const EditItemModal = asOverlay(
  observer((props: IProps) => {
    const { state, itemId } = props
    const actions = bindActions(state, ChecklistActions)
    const item = state.workspaceShared.listItems.find((i) => i.id === itemId)!

    const quantities = [
      ['2 l', '3 l', '4 l', '5 l', '6 l'],
      ['2 dl', '2,5 dl', '3 dl', '5 dl', '6 dl'],
      ['100 g', '200 g', '300 g', '500 g', '800 g'],
      ['1 kg', '1,5 kg', '2 kg', '3 kg', '4 kg'],
      ['2 st', '3 st', '4 st', '5 st', '6 st'],
    ]

    return (
      <View style={s.container}>
        <View>
          <Text style={{ paddingBottom: 14 }} opacity={0.6}>
            {state.categories[state.products[item.product!].category!]?.name}
          </Text>
          <View style={{ marginHorizontal: -C.GutterSize }}>
            <ListItemView
              item={item}
              products={state.products}
              isCheckMode
              onPress={actions.pressListItem(item)}
            />
          </View>
          <Text style={{ paddingVertical: 14 }} opacity={0.6}>
            Label
          </Text>
          <InputField
            name="Label"
            value={boxed(item.quantity, actions.setItemQuantity(item))}
          />
          {quantities.map((row) => (
            <View style={s.row}>
              {row.map((quantity) => (
                <Button
                  containerStyle={{ flex: 1, marginHorizontal: 4 }}
                  text={quantity}
                  onPress={() => actions.setItemQuantity(item)(quantity)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    )
  }),
)

const s = StyleSheet.create({
  container: {
    padding: C.GutterSize,
    flex: 1,
    backgroundColor: C.Colors.blackLight,
  },
  row: {
    // width: '100%',
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 8,
  },
})
