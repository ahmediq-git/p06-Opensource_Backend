import axios from "axios";
class EzBaseClient {
    #backendUrl;//declare private variable for backendURL

    constructor(backendUrl) {
    
        if (!this.#isValidUrl(backendUrl)) {
            throw new Error('Invalid URL for backend. Please provide a valid URL.');
        }

        if (!backendUrl.startsWith("http://")) {
            backendUrl = "http://" + backendUrl;
        }

        this.#backendUrl = backendUrl;
    }

    // checks if URL is valid
    #isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Sends to the backend using the given method and api endpoint
    async sendToBackend(jsonObject, apiEndpoint, method) {
        const completeApiEndpoint = `${this.#backendUrl}${apiEndpoint}`;
    
        const headers = {
            'Content-Type': 'application/json',
        };
    
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
                    response = await axios.get(completeApiEndpoint, { params: jsonObject, headers });
                    console.log('Data received successfully:', response.data);
                    return response.data;
                default:
                    console.error('Invalid method:', method);
                    return;
            }
        } catch (error) {
            if (error.response) {
                console.error('Error sending data to server:', error.response.status, error.response.statusText, error.response.data);
            } else if (error.request) {
                console.error('No response received from server:', error.request);
            } else {
                console.error('Request failed with error:', error.message);
            }
        }
    }

}
export default EzBaseClient;