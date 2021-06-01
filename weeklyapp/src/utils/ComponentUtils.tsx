import React from 'react'
import { AppState } from '../AppState'
import { OverlayContainer, Overlay } from '../components/Overlay'

export interface IPageProps {
  appState: AppState
}

abstract class PageComponent extends React.Component<IPageProps> {}

const withAppState = <T extends IPageProps>(
  appState: AppState,
  Component: React.ComponentType<T>,
) => (props: any) => <Component appState={appState} {...props} />

const withOverlay = <T extends {}>(Component: React.ComponentType<T>) => (
  props: T,
) => (
  <OverlayContainer>
    <Component {...props} />
  </OverlayContainer>
)

const asOverlay = <T extends {}>(
  Component: React.ComponentType<T>,
): React.ComponentType<T & { show: boolean }> => (props) => (
  <Overlay show={props.show}>
    <Component {...props} />
  </Overlay>
)

function bindActions<G>(
  appState: AppState,
  fnMap: { [K in keyof G]: (s: AppState) => G[K] },
): { [K in keyof G]: G[K] } {
  const mappedFns: any = {}

  /* tslint:disable */
  for (const key in fnMap) {
    const fn = fnMap[key]
    const boundFn: any = fn(appState)
    mappedFns[key] = boundFn // createCallProxy(appState, boundFn)
  }
  /* tslint:enable */

  return mappedFns
}

function createCallProxy(appState: AppState, boundFn: Function): Function {
  return function () {
    // here we can catch exceptions and set some state
    return boundFn.apply(null, arguments)
  }
}

export const Slop10 = { top: 20, left: 20, right: 20, bottom: 20 }

export { PageComponent, withAppState, withOverlay, asOverlay, bindActions }
