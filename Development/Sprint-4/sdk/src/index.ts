// importing all classes and functions
import EzBaseClient from "./client";
import Crud from "./crud/crud";
import Auth from "./auth/auth";
import AuthStore from "./auth/AuthStore/store";
import Mail from "./mail";
import RealtimeService from "./realtime";
import Files from "./files/files"

// exporting our ezbase object with which our client will interact with the backend
export default class ezbase {
    private authStore;
    private ezBaseClient;
    db: Crud;
    auth: Auth;
    mail: Mail;
    rts: RealtimeService;
    files: Files

    constructor(url: string, socketUrl:string) {
        this.authStore = new AuthStore();
        this.ezBaseClient = new EzBaseClient(url, this.authStore,socketUrl); //initialising our client object with the url provided by the user.
        this.db = new Crud(this.ezBaseClient, this.authStore); //initialising our database object and passing our client object so the CRUD can send to the user
        this.auth = new Auth(this.ezBaseClient, this.authStore); //initialising our auth object with the url provided by the user
        this.mail = new Mail(this.ezBaseClient, this.authStore); //initialising our mail object with the url provided by the user
        this.rts = new RealtimeService(this.ezBaseClient,this.authStore); //initialising our realtime object with the
        this.files = new Files(url, this.authStore); //initialising the file object
    }
    persistAuth(jwtToken: string, user_id: string) {
        this.authStore.persist(jwtToken,user_id);
    }
}