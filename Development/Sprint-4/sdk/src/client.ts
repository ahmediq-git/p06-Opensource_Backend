import axios, { AxiosResponse } from "axios";
import ValidationUtils from "./validators/validators";
export type CustomResponse = {
    data: any;
    error: any;
    status: number;
}

class EzBaseClient {
    private backendUrl: string;
    private socketUrl: string;
    authStore: any;

    constructor(backendUrl: string, authStore: any, socketUrl: string) {
        if (!ValidationUtils.isValidUrl(backendUrl)) {
            throw new Error('Invalid URL for backend. Please provide a valid URL.');
        }

        // if (!backendUrl.startsWith("http://")) {
        //     backendUrl = "http://" + backendUrl;
        // }
        this.socketUrl = socketUrl;
        this.backendUrl = backendUrl;
        this.authStore = authStore;
    }

    // Sends to the backend using the given method and api endpoint
    async sendToBackend(jsonObject: any, apiEndpoint: string, method: 'POST' | 'DELETE' | 'GET' | 'PATCH', isFile: boolean = false): Promise<AxiosResponse<any> | void | CustomResponse> {
        let completeApiEndpoint = `${this.backendUrl}${apiEndpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authStore.getToken(),
        };

        if (isFile && method === 'POST') {
            headers['Content-Type'] ='multipart/form-data';
            console.log("headers", headers)
        }
       
        try {
            let response;

            switch (method) {
                case 'POST':
                    response = await axios.post(completeApiEndpoint, jsonObject, { headers });
                    console.log('Data sent successfully:', response.data);
                    if (response?.data.error !== null) {
                       throw new Error(response?.data.error)
                    }
                    return {
                        data: response.data.data,
                        error: null,
                        status: response.status
                    }
                case 'PATCH':
                        response = await axios.patch(completeApiEndpoint, jsonObject, { headers });
                        // console.log('Data sent successfully:', response.data);
                        if (response?.data.error !== null) {
                           throw new Error(response?.data.error)
                        }
                        return {
                            data: response.data.data,
                            error: null,
                            status: response.status
                        }
                case 'DELETE':
                    response = await axios.delete(completeApiEndpoint, { data: jsonObject, headers });
                    // console.log('Data sent for deletion successfully:', response.data);
                    if (response?.data.error !== null) {
                        throw new Error(response?.data.error)
                     }
                    return {
                        data: response.data.data,
                        error: null,
                        status: response.status
                    };
                case 'GET':
                    const values = Object.values(jsonObject);
                    if (values.length > 0) {
                        completeApiEndpoint += values.map(value => `/${value}`).join('');
                        console.log(completeApiEndpoint)
                    }
                    response = await axios.get(completeApiEndpoint, { headers });
                    if (response?.data.error !== null) {
                        throw new Error(response?.data.error)
                     }
                    console.log('Data received successfully:', response.data);
                    return {
                        data: response.data.data,
                        error: null,
                        status: response.status
                    }
                default:
                    console.error('Invalid method:', method);
                    return;
            }
        } catch (error: any) {
            console.log("client errir",error)
            let errorResponse = {
                status: error.response?.status || 500,
                error: error.response?.data?.error || 'An unexpected error occurred',
                data: null // Assuming there's no data when an error occurs
            };

            if (error.response) {
                console.error('Error sending data to server:', errorResponse);
            } else if (error.request) {
                console.error('No response received from server:', errorResponse);
                return error;
            } else {
                console.error('Request failed with error:', errorResponse);
            }
            throw errorResponse;
        }
    }
}

export default EzBaseClient;
