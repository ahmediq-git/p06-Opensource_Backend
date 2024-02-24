import axios, { AxiosResponse } from "axios";
import ValidationUtils from "./validators/validators";

class EzBaseClient {
    private backendUrl: string;
    authStore: any;

    constructor(backendUrl: string, authStore: any) {
        if (!ValidationUtils.isValidUrl(backendUrl)) {
            throw new Error('Invalid URL for backend. Please provide a valid URL.');
        }

        if (!backendUrl.startsWith("http://")) {
            backendUrl = "http://" + backendUrl;
        }

        this.backendUrl = backendUrl;
        this.authStore = authStore;
    }

    // Sends to the backend using the given method and api endpoint
    async sendToBackend(jsonObject: any, apiEndpoint: string, method: 'POST' | 'DELETE' | 'GET'): Promise<AxiosResponse<any> | void> {
        let completeApiEndpoint = `${this.backendUrl}${apiEndpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': this.authStore.jwtToken,
        };

        try {
            let response;

            switch (method) {
                case 'POST':
                    response = await axios.post(completeApiEndpoint, jsonObject, { headers });
                    // console.log('Data sent successfully:', response.data);
                    return response;
                case 'DELETE':
                    response = await axios.delete(completeApiEndpoint, { data: jsonObject, headers });
                    // console.log('Data sent for deletion successfully:', response.data);
                    return response;
                case 'GET':
                    const values = Object.values(jsonObject);
                    if (values.length > 0) {
                        completeApiEndpoint += values.map(value => `/${value}`).join('');
                        console.log(completeApiEndpoint)
                    }
                    response = await axios.get(completeApiEndpoint, { headers });
                    // console.log('Data received successfully:', response.data);
                    return response;
                default:
                    console.error('Invalid method:', method);
                    return;
            }
        } catch (error: any) {
            if (error.response) {
                console.error('Error sending data to server:', error);
            } else if (error.request) {
                console.error('No response received from server:', error);
                return error;
            } else {
                console.error('Request failed with error:', error);
            }
            return error
        }
    }
}

export default EzBaseClient;
