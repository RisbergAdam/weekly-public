import { Navigation } from 'react-native-navigation'
import { LoginView } from './views/login/LoginView'
import { HomeView } from './views/home/HomeView'
import { WorkspaceView } from './views/home/WorkspaceView'
import { loadFixture } from './Fixture'
import { appState } from './AppState'
import { Alert, LogBox, Platform, UIManager } from 'react-native'
import { AddProductView } from './views/checklist/AddProductView'
import { configure } from 'mobx'
import { CreateWorkspaceView } from './views/home/CreateWorkspaceView'

// polyfill
process.nextTick = setImmediate

export const setup = async () => {
  configure({ enforceActions: 'never' })

  /*if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }*/

  // LogBox.ignoreAllLogs(true)
  // loadFixture(appState)

  LoginView.register(Navigation)
  HomeView.register(Navigation)
  WorkspaceView.register(Navigation)
  AddProductView.register(Navigation)
  CreateWorkspaceView.register(Navigation)

  Navigation.setDefaultOptions({
    statusBar: {
      backgroundColor: '#ff0000',
    },
    topBar: {
      visible: false,
    },
    layout: {
      backgroundColor: '#000000',
    },
    animations: {
      push: { waitForRender: true },
    },
  })

  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
        stack: {
          id: 'APP_STACK',
          children: [
            {
              component: { name: LoginView.name },
              // component: { name: HomeView.name },
              // component: { name: WorkspaceView.name },
            },
          ],
        },
      },
    })
  })
}
