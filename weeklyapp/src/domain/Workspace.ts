import { allObservable } from "../utils/Decorators";
import { Id } from "./Types";

export enum WorkView {
  Recipes,
  Calendar,
  Checklist,
  Settings,
}

export enum CheckViewMode {
  AddItems,
  CheckItems,
}

@allObservable
class Workspace {
  public id: Id = -1;
  public name = "";
  public currentUsers = 0;
  public maxUsers = 0;
}

@allObservable
class WorkspaceDetails extends Workspace {
  public members: WorkspaceMember[] = [];
}

class WorkspaceMember {
  public id: Id = -1;
  public firstName = "";
  public lastName = "";
  public admin = false;
}

class WorkspaceInvitation {
  public id: Id = -1;
  public workspace: Id = -1;
  public code = "";
  public singleUse = false;
  public validUntil = new Date();
}

export { Workspace, WorkspaceDetails, WorkspaceMember, WorkspaceInvitation };
