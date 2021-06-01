import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, ItemSelect, Text } from '../../components'
import { Add } from '../../components/icons/Add'
import { AutocompleteScreen } from '../../components/item-select/AutocompleteScreen'
import { Product, ProductCategory } from '../../domain'
import { Id, IdMap, IdMapValues } from '../../domain/Types'

interface IProps {
  addListItem: (id: Id) => any
  products: IdMap<Product>
  addProduct: (_: string) => any
  categories: IdMap<ProductCategory>
  isOpen: boolean
  setOpen: (open: boolean) => any
}

const AddItemField = observer((props: IProps) => {
  const renderProduct = (p: Product) => {
    const { categories } = props

    return {
      id: p.id,
      value: (
        <View style={style.product}>
          <Text bold={true}>{p.name}</Text>
          <Text style={style.categoryText} size={11}>
            {(categories[p.category!!] || { name: 'undefined' }).name}
          </Text>
        </View>
      ),
      searchText: p.name,
    }
  }

  const { addListItem, products, addProduct, isOpen, setOpen } = props
  return (
    <>
      <ItemSelect placeholder="Add item..." isOpen={isOpen} onPress={setOpen}>
        <AutocompleteScreen
          items={IdMapValues(products).map(renderProduct)}
          onSelect={addListItem}
          show={isOpen}
          addText={
            <View style={{ flexDirection: 'row' }}>
              <Add style={{ opacity: 0.6, top: -1.5, marginRight: 4 }} />
              <Text style={{ opacity: 0.5 }}>Add new product</Text>
            </View>
          }
          onAdd={addProduct}
        />
      </ItemSelect>
    </>
  )
})

const style = StyleSheet.create({
  product: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  categoryText: {
    paddingLeft: 12,
    opacity: 0.5,
  },
})

export { AddItemField }
