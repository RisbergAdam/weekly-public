import { ShareService } from "./services/ShareService";

export type Id = string;

export interface IdMap<T> {
  [_: string]: T;
}

export type Services = {
  shareService: ShareService;
};

export type AccountInformation = {
  id: string;
  firstName: string;
  lastName: string;
};

export type DocumentIdentifier = {
  collection: string;
  documentId: Id;
};

export type UserWebsocketSession = {
  accountInfo: AccountInformation;
  workspaceAccess: IdMap<boolean>;
  subscribedDocuments: DocumentIdentifier[];
  connected: boolean;
};
