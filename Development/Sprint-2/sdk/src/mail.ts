import ValidationUtils from "./validators/validators.js";
import axios, { AxiosResponse } from "axios";

class Mail {
    private client: any;
    private authStore: any;

    constructor(ezBaseClient: any, authStore: any) {
        this.client = ezBaseClient; // Passing the client object to send to the user.
        this.authStore = authStore; // Passing the authStore object to send to the user.
    }

    // Sends an email to the given email address
    async sendTextMail(to: string, subject: string, message: string): Promise<any> {
        try {
            if (!ValidationUtils.isValidEmail(to)) {
                throw new Error("Invalid Email name");
            }

            const sendObject = { "to": to, "subject": subject, "text": message };

            const response = await this.client.sendToBackend(sendObject, "/api/mail/sendTextMail", "POST");
            console.log("Email sent successfully:", response.data);
            return response
        } catch (error) {
            console.log("Error sending email: ", error);
            return error
        }
    }

    async sendHtmlMail(to: string, subject: string, message: string): Promise<any> {
        try {
            if (!ValidationUtils.isValidEmail(to)) {
                throw new Error("Invalid Email name");
            }

            const sendObject = { "to": to, "subject": subject, "html": message };

            const response = await this.client.sendToBackend(sendObject, "/api/mail/sendHtmlMail", "POST");
            console.log("Email sent successfully:", response.data);
            return response
        } catch (error) {
            console.log("Error sending email: ", error);
            return error
        }
    }
}

export default Mail;