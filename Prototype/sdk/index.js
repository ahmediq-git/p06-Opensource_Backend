// importing all classes and functions
import EzBaseClient from "./client.js";
import Crud from "./crud/crud.js";


// exporting our ezbase object with which our client will interact with the backend
export default class ezbase {
  constructor(url) {
    this._ezBaseClient = new EzBaseClient(url); //initialising our client object with the url provided by the user.
    this.database = new Crud(this._ezBaseClient); //initialising our database object and passing our client object so the CRUD can send to the user
  }
}