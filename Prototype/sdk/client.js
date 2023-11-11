import axios from "axios";
class EzBaseClient {
    #backendUrl;//declare private variable for backendURL

    constructor(backendUrl) {
        if (!this.#isValidUrl(backendUrl)) {
            throw new Error('Invalid URL for backend. Please provide a valid URL.');
        }

        this.#backendUrl = backendUrl;
    }

    #isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
    async sendToBackend(jsonObject, apiEndpoint) {
        // constructing the endpoint with the backend url
        const completeApiEndpoint = `${this.backendUrl}${apiEndpoint}`;

        try {
            const response = await axios.post(completeApiEndpoint, jsonObject, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Data sent successfully:', response.data);
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