import axios from "axios";
import ValidationUtils from "./validators/validators.js";
class EzBaseClient {
    #backendUrl;//declare private variable for backendURL

    constructor(backendUrl) {
    
        if (!ValidationUtils.isValidUrl(backendUrl)) {
            throw new Error('Invalid URL for backend. Please provide a valid URL.');
        }

        if (!backendUrl.startsWith("http://")) {
            backendUrl = "http://" + backendUrl;
        }

        this.#backendUrl = backendUrl;
    }

    // Sends to the backend using the given method and api endpoint
    async sendToBackend(jsonObject, apiEndpoint, method) {
        let completeApiEndpoint = `${this.#backendUrl}${apiEndpoint}`;
    
        const headers = {
            'Content-Type': 'application/json',
        };
        // console.log(jsonObject, apiEndpoint, method);
        try {
            let response;
    
            switch (method) {
                case 'POST':
                    response = await axios.post(completeApiEndpoint, jsonObject, { headers });
                    console.log('Data sent successfully:', response.data);
                    return response.data;
                case 'DELETE':
                    response = await axios.delete(completeApiEndpoint, { data: jsonObject, headers });
                    console.log('Data sent for deletion successfully:', response.data);
                    return response.data;
                case 'GET':
                    const values = Object.values(jsonObject);
                    completeApiEndpoint += values.map(value => `/${value}`).join('');
                    console.log(completeApiEndpoint)
                    response = await axios.get(completeApiEndpoint, { headers });
                    console.log('Data received successfully:', response.data);
                    return response.data;
                default:
                    console.error('Invalid method:', method);
                    return;
            }
        } catch (error) {
            if (error.response) {
                console.error('Error sending data to server:', error);
            } else if (error.request) {
                console.error('No response received from server:', error);
            } else {
                console.error('Request failed with error:', error);
            }
        }
    }

}
export default EzBaseClient;