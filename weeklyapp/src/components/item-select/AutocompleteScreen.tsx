import fuzzysort from 'fuzzysort'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component, useState } from 'react'
import { Id } from '../../domain/Types'
import { Renderable } from '../../utils/Renderable'
import { SelectScreen } from './SelectScreen'

interface Item {
  id: Id
  value: Renderable
  searchText: string
}

interface IProps {
  items?: Item[]
  onSelect?: (_: Id) => any
  addText?: Renderable
  onAdd?: (_: string) => any
  show?: boolean
}

export const AutocompleteScreen = (props: IProps) => {
  const { onSelect, items, addText, onAdd, show } = props
  const [searchText, setSearchText] = useState('')

  const onSelectIntercept = (id: Id) => {
    setSearchText('')
    if (onSelect) {
      onSelect(id)
    }
  }

  const searchResult = fuzzysort
    .go(searchText, items || [], { key: 'searchText', limit: 15 })
    .map((i) => i.obj)

  return (
    <SelectScreen
      items={searchResult}
      onSelect={onSelectIntercept}
      searchText={searchText}
      onSearchText={setSearchText}
      addText={addText}
      onAdd={onAdd}
      show={show}
    />
  )
}
