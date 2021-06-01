import { allObservable } from "../utils/Decorators";
import { Id } from "./Types";

@allObservable
class ScheduledItem {
  public id: Id = "";
  public date: Date = new Date(Date.now());
  public mainQuest: string = "";
  public sideQuests: string[] = [];
}

export { ScheduledItem };
