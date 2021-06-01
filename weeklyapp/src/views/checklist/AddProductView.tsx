import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { appState } from '../../AppState'

import {
  Button,
  InputField,
  ItemSelect,
  OverlayContainer,
  SafestView,
  SelectScreen,
  ThinHeader,
} from '../../components'

import { CloseableView } from '../../components/CloseableView'
import { IdMapValues } from '../../domain/Types'
import { Box } from '../../utils/Box'
import { bindActions, PageComponent } from '../../utils/ComponentUtils'
import { view } from '../../utils/View'
import * as C from '../../Constants'
import ChecklistActions from './ChecklistActions'
import { Navigation } from 'react-native-navigation'
/*
@observer
class AddProductView extends PageComponent {
  public state = this.props.appState;
  public store = new AddProductStore();
  public actions = bindActions(this.props.appState, AddProductActions);

  public componentWillMount() {
    this.store.productName = new Box(this.props.navigation.getParam("productName"));
  }

  public render() {*/

interface IProps {
  productName?: string
}

export const AddProductView = view('ADD_PRODUCT_VIEW', (props: IProps) => {
  const store = appState
  const workspace = store.workspaceLocal
  const actions = bindActions(store, ChecklistActions)

  console.log('add product view render')
  workspace.choosingCategory

  /*useEffect(() => {
    workspace.createProductName.value = props.productName
  }, [])*/

  const selectedCategory = IdMapValues(store.categories).find(
    (c) => c.id === store.workspaceLocal.createProductCategory.value?.id,
  )

  return (
    <>
      <SafestView>
        <ThinHeader
          title="Create product"
          actionType="close"
          onAction={actions.addProductView.exitView}
        />
        <OverlayContainer avoidKeyboard={false}>
          <View style={s.container}>
            <InputField
              name="Product name"
              value={workspace.createProductName}
            />

            <ItemSelect
              name="Category"
              value={selectedCategory && selectedCategory.name}
              isOpen={workspace.choosingCategory}
              onPress={actions.addProductView.openCategoryModal}>
              <SelectScreen
                show={workspace.choosingCategory}
                items={IdMapValues(store.categories).map((p) => ({
                  id: p.id,
                  value: p.name,
                }))}
                onSelect={(category) =>
                  (workspace.createProductCategory.value =
                    store.categories[category])
                }
              />
            </ItemSelect>

            <View style={{ flex: 1 }} />

            <Button
              style={{ width: '100%' }}
              text="Add product"
              onPress={actions.addProductView.createProduct}
            />
          </View>
        </OverlayContainer>
      </SafestView>
    </>
  )
})

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: C.GutterSize,
    backgroundColor: C.Colors.blackDark,
  },
})
