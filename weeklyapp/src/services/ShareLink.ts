import ReconnectingWebSocket from 'reconnecting-websocket'
import ShareDb from 'sharedb/lib/client'

import { AppState } from '../AppState'
import { configuration } from '../Configuration'

class ShareLink {
  private socket: ReconnectingWebSocket = null!

  private share: ShareDb.Connection = null!

  private accessToken: string = null!

  constructor(private appState: AppState) {}

  public async connect(accessToken: string): Promise<void> {
    this.accessToken = accessToken

    this.socket = new ReconnectingWebSocket(
      configuration.shareUrl + '?accessToken=' + this.accessToken,
    )

    this.socket.addEventListener('open', this.onSocketConnected)
    this.socket.addEventListener('close', this.onSocketDisconnected)

    this.share = new ShareDb.Connection(this.socket as WebSocket)
    this.share.debug = true
  }

  public disconnect() {
    console.log('manual disconnect')
    this.socket.close()
    this.socket.removeEventListener('open', this.onSocketConnected)
    this.socket.removeEventListener('close', this.onSocketDisconnected)
    this.socket = null!
    this.share = null!
  }

  public subscribe(
    collection: string,
    documentId: number,
  ): Promise<ShareDb.Doc> {
    const document = this.share.get(collection, documentId.toString())

    return new Promise((resolve, reject) => {
      console.log('subscribing...')
      document.subscribe((err) => {
        console.log('subscribed!')
        if (err) {
          reject(err)
        } else {
          resolve(document)
        }
      })
    })
  }

  public refresh() {
    this.socket.reconnect()
  }

  private onSocketConnected = () => {
    this.appState.isShareLinkConnected = true
  }

  private onSocketDisconnected = (e: any) => {
    this.appState.isShareLinkConnected = false
  }
}

export { ShareLink }
