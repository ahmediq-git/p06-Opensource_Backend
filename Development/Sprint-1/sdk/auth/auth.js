import ValidationUtils from "../validators/validators.js";

class Auth {
    constructor(ezBaseClient) {
        this.client = ezBaseClient; //passing the client object to send to the user.
    }

    // signs in the user with the given email and password
    async signUp(email, password) {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error("Invalid Email name")
            }

            const sendObject = { "email": email, "password": password }

            await this.client.sendToBackend(sendObject, "/signup_email", "POST")
        } catch (error) {
            console.log("Error signing in ", error)
        }
    }

    // signs in the user with the given email and password
    async signIn(email, password) {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error("Invalid Email name")
            }

            const sendObject = { "email": email, "password": password }

            await this.client.sendToBackend(sendObject, "/signin_email", "POST")
        } catch (error) {
            console.log("Error signing in ", error)
        }
    }

    // signs out the current user logged in
    async signOut() {
        try {
            await this.client.sendToBackend({}, "/signout", "GET")

        } catch (error) {
            console.log("Error signing out: ", error)
        }
    }

   // returns the json dictionary data pertaining to the user currently signed in
   async currentUser() {

   }

   // updates user Email (provided the user is already signed in)
   async updateEmail(email) {

   }

   // updates user's password (provided the user is already signed in)
   async updatePassword(password) {

   }

   // if user forgets the password, the user enters the email they registered on the service with and they will receive an email with a link to reset the password
   async forgetPassword(email){
    // the email must be in the user database, and the forgot password data should be sent to just that email for safety
   }


}

export default Auth;