import { allObservable } from "../utils/Decorators";
import { Id } from "./Types";

@allObservable
class User {
  public id: Id = "";
  public username: string = "";
  public firstName: string = "";
  public lastName: string = "";
}

export { User };
