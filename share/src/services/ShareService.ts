import * as WebSocket from "ws";
import * as ShareDb from "sharedb";
import * as WebSocketJsonStream from "websocket-json-stream";
import * as shareDbAccess from "sharedb-access";

import { UserWebsocketSession, Id } from "../Types";
import { ShareDbAccess, DocumentAuthorizer } from "./DocumentAuthorizer";
import { ConnectionTracker } from "./ConnectionTracker";
import { SharePostgres } from "./SharePostgres";
import { BackendService } from "./BackendService";

export class ShareService {
  private shareDb: ShareDbAccess;

  constructor(
    authorizer: DocumentAuthorizer,
    private sessionTracker: ConnectionTracker,
    private backend: BackendService
  ) {
    // const pgOptions = {
    //     host: "localhost",
    //     database: "weekly_develop",
    //     user: "weekly_develop",
    //     password: "weekly_develop"
    // };

    const pgOptions = {
      host: "127.0.0.1",
      database: "weekly_local",
      user: "postgres",
      password: "postgres",
    };

    var postgres = new SharePostgres(pgOptions);
    this.shareDb = new ShareDb({ db: postgres }) as ShareDbAccess;

    shareDbAccess(this.shareDb);
    authorizer.setupAccess(this.shareDb);

    this.shareDb.use("connect", this.authMiddleware);
    this.shareDb.use("receive", this.onReceive);

    /*const document = this.shareDb.connect().get("workspaces", "1");

        document.fetch(() => {
            document.create({
                listItems: [],
                clearedListItems: [],
                customProducts: {},
                users: {}
            });
        });*/
  }

  public accept(socket: WebSocket, accessToken: string) {
    const jsonStream = new WebSocketJsonStream(socket);
    (this.shareDb as any).listen(jsonStream, accessToken || "");
  }

  public getDocument(collection: string, documentId: Id): Promise<ShareDb.Doc> {
    const document = this.shareDb.connect().get(collection, documentId);
    return new Promise((resolve, reject) => {
      document.fetch((err) => {
        if (err) reject(err);
        else resolve(document);
      });
    });
  }

  private authMiddleware = async (context, callback) => {
    if (!context.req) {
      callback();
      return;
    }

    if (typeof context.req !== "string") {
      callback({ error: "No access token found when connecting socket" });
      return;
    }

    const accessToken: string = context.req;
    const introspectResult = await this.backend.intospect(accessToken);

    if (!introspectResult.isOk) {
      callback({ error: "Websocket was not authenticated!" });
      return;
    }

    const accountInfo = introspectResult.unwrap();

    const session: UserWebsocketSession = {
      accountInfo: accountInfo.profile,
      workspaceAccess: {},
      subscribedDocuments: [],
      connected: true,
    };

    console.log("Session connected", session);
    context.agent.connectSession = session;
    context.stream.on("close", () =>
      this.sessionTracker.socketDisconnected(session)
    );

    callback();
  };

  private onReceive = (context, next) => {
    const op = context.data;

    const session: UserWebsocketSession = context.agent.connectSession;

    if (op.a === "s") {
      const collection = op.c;
      const documentId = op.d;
      this.sessionTracker.documentSubscribed(session, collection, documentId);
    } else if (op.a === "u") {
      const collection = op.c;
      const documentId = op.d;
      this.sessionTracker.documentUnsubscribed(session, collection, documentId);
    }

    next();
  };
}

/*const document = this.shareDb.connect().get("workspaces", "1");

document.fetch(() => {
    document.create({
        listItems: [],
        clearedListItems: [],
        customProducts: {},
        users: {}
    });
});*/
