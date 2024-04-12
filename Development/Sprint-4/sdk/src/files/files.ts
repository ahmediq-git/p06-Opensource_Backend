import ValidationUtils from "../validators/validators.js";
import axios, { AxiosResponse } from "axios";


class Files {
    private client: any;
    private authStore: any;

    constructor( ezBaseClient: any) {
        this.client = ezBaseClient; 
    }

    async uploadFile(file:File):Promise<AxiosResponse<any>>{
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const apiEndpoint = `/api/files`;
            const response = await this.client.sendToBackend(formData, apiEndpoint, "POST",true);
            return response;
        } catch (error) {
            // Handle error
            console.log("Error uploading file:", error);
            throw error;
        }
       
    }

    async getFile(file_name:string):Promise<AxiosResponse<any>>{
        try{
            const apiEndpoint=`/api/files?file_name=${file_name}`
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET",true);
            return response;
        } catch (error){
            // Handle error
            console.log("Error getting file:", error);
            throw error;
        }
    }

    async getFileUrl(file_id:string):Promise<AxiosResponse<any>>{
        try {
            const apiEndpoint = `/api/files/url?id=${file_id}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");
            return response;
        } catch (error) {
            // Handle error
            console.log("Error getting file url:", error);
            throw error;
        }
    }

    async getFileMetaData(id: string):Promise<AxiosResponse<any>>{
        try {
            const apiEndpoint=`/api/files/metadata?id=${id}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");
            return response;
        } catch (error) {
            // Handle error
            console.log("Error getting file metadata:", error);
            throw error;
        }
    }

    async deleteFile(id: string): Promise<AxiosResponse<any>>{
        try {
            const apiEndpoint = `/api/files/${id}`;
            const res = await this.client.sendToBackend({}, apiEndpoint, "DELETE");
            console.log("File deleted successfully");
            return res;
        } catch (error) {
            // Handle error
            console.log("Error deleting file:", error);
            throw error;
        }
    }
}

export default Files;