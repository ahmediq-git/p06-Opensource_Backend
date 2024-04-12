import ValidationUtils from "../validators/validators";
import { AxiosResponse } from "axios";
class Auth {
    private client: any;
    private authStore: any;

    constructor(ezBaseClient: any, authStore: any) {
        this.client = ezBaseClient; // Passing the client object to send to the user.
        this.authStore = authStore; // Passing the authStore object to send to the user.
    }

    // Signs up the user with the given email and password
    async signUp(email: string, password: string, user_metadata: object = {}): Promise<AxiosResponse<any>> {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error("Invalid Email name");
            }

            const sendObject = { "email": email, "password": password, user_metadata };

            const response = await this.client.sendToBackend(sendObject, "/api/auth/user/create", "POST");
            console.log(response.data)
            this.authStore.saveTokenFromResponse(response.data);
            return response;
        } catch (error) {
            console.log("Error signing up ", error);
            throw error
        }
    }

    // Signs in the user with the given email and password
    async signIn(email: string, password: string): Promise<AxiosResponse<any>> {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error("Invalid Email name");
            }

            const sendObject = { "email": email, "password": password};

            const response = await this.client.sendToBackend(sendObject, "/api/auth/user/login", "POST");
            console.log(response)
            this.authStore.saveTokenFromResponse(response.data);
            return response;
        } catch (error) {
            console.log("Error signing in ", error);
            throw error
        }
    }

    // Signs out the current user logged in
    async signOut(): Promise<void> {
        try {
            this.authStore.removeToken();
        } catch (error) {
            console.log("Error signing out: ", error);
            throw error
        }
    }

    // Returns the json dictionary data pertaining to the user currently signed in
    currentUser(): string {
        // Implementation goes here
        return this.authStore.user_id;
    }

    isAuthenticated(): boolean {
        // Implementation goes here
        return this.authStore.isAuthenticated();
    }

    // getToken(): string | undefined {
    //     // Assuming synchronous access to token in authStore
    //     return this.authStore.token;
    //   }
    getToken(): string {
        try{
            const local_token = localStorage.getItem(this.authStore.STORAGE_KEY_TOKEN);
            return this.authStore.token = local_token || "";
        }catch(err){
            // console.log("err in  get token",err);
            return "";
        }
    
      }

    async signInWithGoogle(): Promise<AxiosResponse<any>>{
        const response = await this.client.sendToBackend({}, "/api/auth/google_oauth", "GET");
        console.log(response)
        return response;
    }
    

    // Updates user Email (provided the user is already signed in)
    async updateEmail(email: string): Promise<void> {
        // Implementation goes here
    }

    // Updates user's password (provided the user is already signed in)
    async updatePassword(password: string): Promise<void> {
        // Implementation goes here
    }

    // If user forgets the password, the user enters the email they registered on the service with and they will receive an email with a link to reset the password
    async forgetPassword(email: string): Promise<void> {
        // The email must be in the user database, and the forgot password data should be sent to just that email for safety
    }
}

export default Auth;
