import ValidationUtils from "../validators/validators";

class Auth {
    private client: any;
    private authStore: any;

    constructor(ezBaseClient: any, authStore: any) {
        this.client = ezBaseClient; // Passing the client object to send to the user.
        this.authStore = authStore; // Passing the authStore object to send to the user.
    }

    // Signs up the user with the given email and password
    async signUp(email: string, password: string): Promise<void> {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error("Invalid Email name");
            }

            const sendObject = { "email": email, "password": password };

            const response = await this.client.sendToBackend(sendObject, "/signup_email", "POST");
            this.authStore.saveTokenFromResponse(response);
        } catch (error) {
            console.log("Error signing in ", error);
        }
    }

    // Signs in the user with the given email and password
    async signIn(email: string, password: string): Promise<void> {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error("Invalid Email name");
            }

            const sendObject = { "email": email, "password": password };

            const response = await this.client.sendToBackend(sendObject, "/signin_email", "POST");
            this.authStore.saveTokenFromResponse(response);
        } catch (error) {
            console.log("Error signing in ", error);
        }
    }

    // Signs out the current user logged in
    async signOut(): Promise<void> {
        try {
            await this.client.sendToBackend({}, "/signout", "GET");
        } catch (error) {
            console.log("Error signing out: ", error);
        }
    }

    // Returns the json dictionary data pertaining to the user currently signed in
    async currentUser(): Promise<void> {
        // Implementation goes here
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
