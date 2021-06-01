import { observer } from 'mobx-react'
import React, { Component } from 'react'
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { List, Settings } from '../../components/icons'
import { Text } from '../../components/Text'
import * as C from '../../Constants'
import { WorkView } from '../../domain/Workspace'
import { Transition } from '../../utils/Transition'

const recipesIcon = require('../../../assets/icons/book.svg.png')
const calendarIcon = require('../../../assets/icons/calendar.svg.png')
const listIcon = require('../../../assets/icons/list.svg.png')
const settingsIcon = require('../../../assets/icons/settings.svg.png')

interface IProps {
  currentView: WorkView
  setWorkView: (_: WorkView) => any
}

@observer
class NavigationFooter extends Component<IProps, any> {
  public render() {
    const { currentView, setWorkView } = this.props

    const recipesProps = {
      text: 'Recipes',
      // source: recipesIcon,
      view: WorkView.Recipes,
      currentView,
      setWorkView,
    }

    const calendarProps = {
      text: 'Calendar',
      // source: calendarIcon,
      view: WorkView.Calendar,
      currentView,
      setWorkView,
    }

    const checklistProps = {
      text: 'Checklist',
      icon: <List />,
      view: WorkView.Checklist,
      currentView,
      setWorkView,
    }

    const settingsProps = {
      text: 'Settings',
      icon: <Settings />,
      view: WorkView.Settings,
      currentView,
      setWorkView,
    }

    return (
      <View style={style.container}>
        {/*<Icon {...recipesProps} />*/}
        {/*<Icon {...calendarProps} />*/}
        <Icon {...checklistProps} />
        <Icon {...settingsProps} />
      </View>
    )
  }
}

interface IPropsIcon {
  text: string
  icon: any
  view: WorkView
  currentView: WorkView
  setWorkView: (_: WorkView) => any
}

class Icon extends React.Component<IPropsIcon, any> {
  public opacity = new Transition(0.25, 100)

  public render() {
    const { view, currentView, setWorkView, icon, text } = this.props

    const isActive = view === currentView

    return (
      <TouchableOpacity activeOpacity={0.8}>
        <Animated.View
          style={{
            ...style.iconContainer,
            opacity: this.opacity.transition(isActive ? 1 : 0.25),
          }}
          onTouchEnd={(e: any) => setWorkView(view)}>
          {icon}
          <Text size={11} style={style.iconText}>
            {text}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: C.Colors.blackLight,
    width: '100%',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    flex: 0,
    marginTop: -6,
    width: 80,
  },
  icon: {
    margin: 5,
    width: 25,
    height: 25,
    marginBottom: 2,
  },
  iconText: {
    marginTop: 0,
  },
})

export { NavigationFooter }
