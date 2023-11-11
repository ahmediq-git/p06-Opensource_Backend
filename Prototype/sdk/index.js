// importing all classes and functions
import EzBaseClient from "./client.js";
import Crud from "./crud/crud.js";


// exporting our object
export default class EzBase {
  constructor(url) {
    this.Crud = new Crud();
    this.EzBaseClient = new EzBaseClient(url);
  }
}