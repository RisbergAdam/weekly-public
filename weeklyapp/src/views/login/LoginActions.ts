import { Alert } from 'react-native'
import uuid from 'uuid/v4'

import { AppState } from '../../AppState'
import { ToMap } from '../../domain/Types'
import { User } from '../../domain/User'
import { getPersistentStore } from '../../PersistentStore'
import { HomeView } from '../home/HomeView'

const TestId1 = 'b781bc1e-9b9c-437f-94da-9a9f8455c351'
const TestId2 = 'qwerty' // localhost

const loginDevice = (state: AppState) => () => async () => {
  const { api, client, shareLink } = state.services

  state.isLoadingLogin = true

  const persistentStore = await getPersistentStore()
  // persistentStore.deviceId = TestId1;
  // persistentStore.deviceId = "";
  let firstLogin = false

  if (persistentStore.deviceId === '') {
    firstLogin = true
    persistentStore.deviceId = uuid()
    // persistentStore.deviceId = "b781bc1e-9b9c-437f-94da-9a9f8455c351";
    await api.postRegister(persistentStore.deviceId)
  }

  const { token } = await api.postLogin(persistentStore.deviceId)
  client.setToken(token)

  const data = await api.getData()
  const workspaces = await api.getWorkspaces()

  state.categories = ToMap(data.categories || [])
  state.productsGlobal = ToMap(data.products || [])
  state.workspaces = workspaces || []

  state.user = new User()
  if (data.profile) {
    state.user.id = data.profile.id
    state.user.firstName = data.profile.firstName
    state.user.lastName = data.profile.lastName
  }

  await shareLink.connect(token)

  state.isLoadingLogin = false

  // navigation.push("Home");
  HomeView.push({})

  if (firstLogin) {
    // navigation.push("Profile");
  }
}

const actions = {
  loginDevice,
}

export default actions
