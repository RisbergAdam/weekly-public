import { create, persist } from 'mobx-persist'
import { AsyncStorage } from 'react-native'
import { allObservable } from './utils/Decorators'

@allObservable
class PersistentStore {
  @persist public deviceId: string = ''
}

let persistentStore: PersistentStore | undefined = undefined

const hydrate = create({ storage: AsyncStorage })

export async function getPersistentStore() {
  if (persistentStore === undefined) {
    persistentStore = new PersistentStore()
    await hydrate('persistentStore', persistentStore)
  }

  return persistentStore
}
