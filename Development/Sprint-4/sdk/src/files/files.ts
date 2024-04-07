import ValidationUtils from "../validators/validators.js";
import axios, { AxiosResponse } from "axios";


class Files {
    private client: any;
    private authStore: any;
    private backendUrl: string

    constructor(backendUrl: string, authStore: any) {
        this.backendUrl = backendUrl
        this.authStore = authStore; //passing the authStore object to send to the user.
    }

    async uploadFile(file:File):Promise<AxiosResponse<any>>{
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const apiEndpoint = `${this.backendUrl}/api/files`;
            const response = await axios.post(apiEndpoint, formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

            return response;
        } catch (error) {
            // Handle error
            console.error("Error uploading file:", error);
            throw error;
        }
       
    }

    async getFile(file_name:string):Promise<AxiosResponse<any>>{
        try{
            const apiEndpoint=`${this.backendUrl}/api/files?file_name=${file_name}`
            const response = await axios.get(apiEndpoint);
            return response;
        } catch (error){
            // Handle error
            console.error("Error getting file:", error);
            throw error;
        }
    }

    async getFileMetaData(id: string):Promise<AxiosResponse<any>>{
        try {
            const apiEndpoint=`${this.backendUrl}/api/files/metadata?id=${id}`;
            const response = await axios.get(apiEndpoint);
            return response;
        } catch (error) {
            // Handle error
            console.error("Error getting file metadata:", error);
            throw error;
        }
    }

    async deleteFile(id: string){
        try {
            const apiEndpoint = `${this.backendUrl}/api/files/${id}`;
            await axios.delete(apiEndpoint);
            console.log("File deleted successfully");
        } catch (error) {
            // Handle error
            console.error("Error deleting file:", error);
            throw error;
        }
    }
}

export default Files;