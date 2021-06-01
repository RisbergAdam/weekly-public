import React, { Component } from 'react'
import { Gateway, GatewayDest, GatewayProvider } from 'react-gateway'
import { StyleSheet, View } from 'react-native'
import { FadeView } from './FadeView'

interface IContainerProps {
  children: any
  avoidKeyboard?: boolean
  name?: string
}

class TransparentView extends Component<any> {
  public render = () => <View pointerEvents="box-none" {...this.props} />
}

class OverlayContainer extends Component<IContainerProps> {
  private PlainContainerView = ({ children }) => (
    <View style={style.container}>{children}</View>
  )

  private KeyboardAvoidingContainerView = ({ children }) => (
    <View style={style.container}>{children}</View>
  )

  public render() {
    const { children, avoidKeyboard = true, name = 'overlay' } = this.props

    let ContainerView = this.PlainContainerView

    if (avoidKeyboard) {
      ContainerView = this.KeyboardAvoidingContainerView
    }

    return (
      <GatewayProvider>
        <ContainerView>
          {children}
          <TransparentView style={style.overlay}>
            <GatewayDest name={name} component={TransparentView} />
          </TransparentView>
        </ContainerView>
      </GatewayProvider>
    )
  }
}

interface IOverlayProps {
  children: any
  show?: boolean
  target?: string
}

const Overlay = (props: IOverlayProps) => {
  const { children, show, target = 'overlay' } = props

  if (show === undefined) {
    return (
      <Gateway into={target}>
        <View style={style.portal}>{children}</View>
      </Gateway>
    )
  }

  return (
    <FadeView
      show={show}
      fade={
        <Gateway into={target}>
          {
            <FadeView
              mount={true}
              show={show}
              style={style.portal}
              fade={children}
            />
          }
          {/* {show && <View style={style.portal}>{children}</View>} */}
        </Gateway>
      }
    />
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  portal: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
})

export { OverlayContainer, Overlay }
