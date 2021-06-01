import * as ShareDb from "sharedb";

import { UserWebsocketSession, Id } from "../Types";
import { BackendService } from "./BackendService";

export class DocumentAuthorizer {
  private backendService: BackendService;

  constructor(backendService: BackendService) {
    this.backendService = backendService;
  }

  public setupAccess(shareDb: ShareDbAccess) {
    shareDb.allowRead("workspaces", this.allowReadWorkspace);
    shareDb.allowUpdate("workspaces", this.allowUpdateWorkspace);
  }

  private allowReadWorkspace = async (
    workspace: Id,
    doc: any,
    session: UserWebsocketSession
  ) => {
    return await this.hasAccessToWorkspace(session, workspace);
  };

  private allowUpdateWorkspace = async (
    workspace: Id,
    oldDoc: any,
    newDoc: any,
    ops: any,
    session: UserWebsocketSession
  ) => {
    return await this.hasAccessToWorkspace(session, workspace);
  };

  private async hasAccessToWorkspace(
    session: UserWebsocketSession,
    workspace: Id
  ): Promise<boolean> {
    let access = session.workspaceAccess[workspace];

    if (access === undefined) {
      const { id } = session.accountInfo;
      const authorized = await this.backendService.canEnterWorkspace(
        id,
        workspace
      );

      //console.log("Authorised " + accountId + " to enter workspace " + workspace + ":", authorized);

      session.workspaceAccess[workspace] = authorized;
      access = authorized;
    }

    if (access !== true) {
      return false;
    } else {
      return true;
    }
  }

  private alwaysAccess = async (
    workspace: Id,
    document: any,
    session: UserWebsocketSession
  ) => {
    return true;
  };
}

export type AccessHandler = (
  collection: string,
  handler: (
    docId: string,
    doc: any,
    session: UserWebsocketSession
  ) => Promise<boolean>
) => void;
export type UpdateHandler = (
  collection: string,
  handler: (
    docId: string,
    oldDoc: any,
    newDoc: any,
    ops: any,
    session: UserWebsocketSession
  ) => Promise<boolean>
) => void;

export type ShareDbAccess = ShareDb & {
  allowRead: AccessHandler;
  denyRead: AccessHandler;
  allowUpdate: UpdateHandler;
  allowCreate: AccessHandler;
  denyCreate: AccessHandler;
};
