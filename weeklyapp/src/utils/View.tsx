import { observer } from 'mobx-react'
import React from 'react'
import { StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'

export type ViewProps<T> = T & {}

export type View<T> = {
  name: string
  register: (n: typeof Navigation) => void
  push: (params: T) => void
  pop: () => void
  component: any
}

export function view<T>(
  viewName: string,
  component: React.FunctionComponent<ViewProps<T>>,
): View<T> {
  const Component = observer(component)

  const Hoc = (props: ViewProps<T>) => {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <Component {...props} />
      </>
    )
  }

  return {
    component,
    name: viewName,
    register: (navigation) => navigation.registerComponent(viewName, () => Hoc),
    push: (params) => {
      Navigation.push('APP_STACK', {
        component: {
          id: viewName,
          name: viewName,
          passProps: params,
        },
      })
    },
    pop: () => {
      Navigation.pop(viewName)
    },
  }
}
