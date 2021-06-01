import { UserWebsocketSession, Id } from "src/Types";
import { ShareService } from "./ShareService";

const trackedCollectionTypes = {
  workspaces: "workspaces",
};

export class ConnectionTracker {
  private shareService: ShareService;

  public setShareService(shareService: ShareService) {
    this.shareService = shareService;
  }

  public socketDisconnected(session: UserWebsocketSession) {
    if (session.connected) {
      console.log("Session diconnected", session.accountInfo.id);
      session.connected = false;
      session.subscribedDocuments.forEach((di) => {
        this.removeUserIndicator(session, di.collection, di.documentId);
      });
    }
  }

  public async documentSubscribed(
    session: UserWebsocketSession,
    collection: string,
    documentId: Id
  ) {
    if (!trackedCollectionTypes[collection]) return;

    console.log(
      "Document subscribe " + collection + " " + documentId + " from",
      session.accountInfo
    );
    session.subscribedDocuments.push({ collection, documentId });

    const document = await this.shareService.getDocument(
      collection,
      documentId
    );
    const { accountInfo } = session;

    const userObject = {
      id: accountInfo.id,
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
    };

    document.submitOp([
      { p: ["users", session.accountInfo.id], oi: userObject },
    ]);
  }

  public async documentUnsubscribed(
    session: UserWebsocketSession,
    collection: string,
    documentId: Id
  ) {
    console.log(
      "Document unsubscribe " + collection + " " + documentId + " from",
      session.accountInfo
    );

    const index = session.subscribedDocuments.findIndex(
      (di) => di.collection === collection && di.documentId === documentId
    );

    if (index === -1) return;

    session.subscribedDocuments.splice(index, 1);

    await this.removeUserIndicator(session, collection, documentId);
  }

  private async removeUserIndicator(
    session: UserWebsocketSession,
    collection: string,
    documentId: Id
  ) {
    const document = await this.shareService.getDocument(
      collection,
      documentId
    );
    const { accountInfo } = session;

    const userObject = {
      id: accountInfo.id,
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
    };

    document.submitOp([
      { p: ["users", session.accountInfo.id], od: userObject },
    ]);
  }
}
