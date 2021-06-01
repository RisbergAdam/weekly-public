import { allObservable } from "../utils/Decorators";
import { Id } from "./Types";

@allObservable
class ProductCategory {
  public id: Id = "";
  public name: string = "";
}

export { ProductCategory };
