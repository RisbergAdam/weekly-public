import { action } from 'mobx'
import { Observer, observer } from 'mobx-react'
import React, { Fragment, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist'
import { FlatList } from 'react-native-gesture-handler'

import { AppState } from '../../AppState'
import { Text } from '../../components'
import { CheckCircle, ClearAll } from '../../components/icons'
import { ToolButton } from '../../components/ToolButton'
import { ListItem } from '../../domain/ListItem'
import { CheckViewMode } from '../../domain/Workspace'
import { bindActions } from '../../utils/ComponentUtils'
import { animateNext } from '../../utils/Transition'
import * as C from './../../Constants'
import { AddItemField } from './AddItemField'
import ChecklistActions from './ChecklistActions'
import { EditItemModal } from './EditItemModal'
import { ListItemView } from './ListItemView'

interface IProps {
  state: AppState
}

export const ChecklistView = observer((props: IProps) => {
  const state = props.state
  const actions = bindActions(state, ChecklistActions)
  const [dragging, setDragging] = useState(false)

  const isCheckMode = () =>
    state.workspaceLocal.checkViewMode === CheckViewMode.CheckItems

  const renderListItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<ListItem>) => (
    <Observer>
      {() => (
        <ListItemView
          key={item.id}
          item={item}
          isCheckMode={isCheckMode()}
          onPress={actions.pressListItem(item)}
          onDrag={drag}
          isActive={isActive}
          products={state.products}
        />
      )}
    </Observer>
  )

  return (
    <View style={s.container}>
      <View style={s.topContainer}>
        <EditItemModal
          state={state}
          show={state.workspaceLocal.editingItem}
          itemId={state.workspaceLocal.editingItemId}
        />
        {!isCheckMode() && (
          <AddItemField
            addListItem={actions.addListItem()}
            addProduct={actions.addProductView.enterView}
            products={state.products}
            categories={state.categories}
            isOpen={state.selectingItem}
            setOpen={(open) => {
              state.selectingItem = open
            }}
          />
        )}
        <View style={s.toolbar}>
          <ToolButton
            icon={<CheckCircle opacity={0.9} />}
            text="Checkmode"
            onPress={() => {
              animateNext()
              actions.toggleCheckMode()
            }}
            style={s.toolButton}
            active={isCheckMode()}
            slim={isCheckMode()}
          />
          <ToolButton
            icon={<ClearAll opacity={0.8} />}
            text="Clear marked"
            onPress={() => {
              actions.clearCheckedItems()
            }}
            style={s.toolButton}
            slim={isCheckMode()}
          />
        </View>
      </View>
      {/* <Separator /> */}
      {/* <ScrollView scrollEnabled={!dragging} style={{ overflow: 'visible' }}> */}
      <FlatList
        data={state.workspaceGroupedListItems}
        keyExtractor={(group) => group.category!.toString()}
        renderItem={({ item: group }) => (
          <Fragment key={group.category}>
            <Text style={s.groupLabel}>
              {state.categories[group.category!]?.name}
            </Text>

            <DraggableFlatList
              //overScrollMode={'never'}
              style={s.group}
              scrollEnabled={false}
              dragItemOverflow={false}
              onDragBegin={() => setDragging(true)}
              onDragEnd={({ data, from, to }) => {
                setDragging(false)
                actions.moveListItem(data[to], to)
              }}
              keyExtractor={(item) => item.id.toString()}
              data={group.items}
              renderItem={renderListItem}
              extraData={group.items.map((i) => i.id).join(',')}
            />
          </Fragment>
        )}
      />
    </View>
  )
})

const s = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  topContainer: {
    padding: C.GutterSize,
    //paddingBottom: 0,
    paddingBottom: 10,
    width: '100%',
    //backgroundColor: C.Colors.blackLight,
  },
  toolbar: {
    flexDirection: 'row-reverse',
  },
  toolButton: {
    marginLeft: 10,
  },
  groupLabel: {
    paddingVertical: 4,
    paddingLeft: 20,
    fontSize: 14,
    opacity: 0.6,
  },
  group: {
    paddingVertical: 10,
    ...C.Shadow,
  },
})
