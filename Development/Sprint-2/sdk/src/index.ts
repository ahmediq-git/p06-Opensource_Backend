// importing all classes and functions
import EzBaseClient from "./client";
import Crud from "./crud/crud";
import Auth from "./auth/auth";
import AuthStore from "./auth/AuthStore/store";

// exporting our ezbase object with which our client will interact with the backend
export default class ezbase {
    private authStore;
    private ezBaseClient;
    db: Crud;
    auth: Auth;

    constructor(url: string) {
        this.authStore = new AuthStore();
        this.ezBaseClient = new EzBaseClient(url, this.authStore); //initialising our client object with the url provided by the user.
        this.db = new Crud(this.ezBaseClient, this.authStore); //initialising our database object and passing our client object so the CRUD can send to the user
        this.auth = new Auth(this.ezBaseClient, this.authStore); //initialising our auth object with the url provided by the user
    }
}