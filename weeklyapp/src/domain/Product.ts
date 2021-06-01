import { allObservable } from "../utils/Decorators";
import { Id, Reference } from "./Types";

@allObservable
class Product {
  public id: Id = -1;
  public name: string = "";
  public category?: Reference;
}

export { Product };
