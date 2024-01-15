// importing all classes and functions
import EzBaseClient from "./client.js";
import Crud from "./crud/crud.js";
import Auth from "./auth/auth.js";
import AuthStore from "./auth/AuthStore/store.js";

// exporting our ezbase object with which our client will interact with the backend
export default class ezbase {
  #authStore;
  #ezBaseClient;

  constructor(url) {
    this.#authStore = new AuthStore();
    this.#ezBaseClient = new EzBaseClient(url, this.#authStore); //initialising our client object with the url provided by the user.
    this.db = new Crud(this.#ezBaseClient, this.#authStore); //initialising our database object and passing our client object so the CRUD can send to the user
    this.auth = new Auth(this.#ezBaseClient, this.#authStore); //initialising our auth object with the url provided by the user
  }
}