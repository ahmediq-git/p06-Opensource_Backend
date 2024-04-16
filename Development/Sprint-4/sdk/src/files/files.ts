import ValidationUtils from "../validators/validators.js";
import axios, { AxiosResponse } from "axios";
import { StorageSharedKeyCredential, BlobServiceClient } from "@azure/storage-blob";


class Files {
    private client: any;
    private authStore: any;

    constructor(ezBaseClient: any) {
        this.client = ezBaseClient;
    }

    async getFileSettings(): Promise<any> {
        try {
            const apiEndpoint = `/api/files/file_settings`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");
            return response;
        } catch (error) {
            console.error("An error occured while getting file settings:", error);
        }
    }

    async uploadFile(file: File): Promise<any> {

        const blobStorageSettings = await this.getFileSettings();
        const blobStorageSettingsData = blobStorageSettings.data;
        const useBlobStorage = blobStorageSettingsData.useBlobStorage;
        if (useBlobStorage) {
            const sharedKeyCredential = new StorageSharedKeyCredential(blobStorageSettingsData.serviceName, blobStorageSettingsData.serviceKey);

            const blobServiceClient = new BlobServiceClient(
                `https://${blobStorageSettingsData.serviceName}.blob.core.windows.net`,
                sharedKeyCredential
            );

            const containerClient = blobServiceClient.getContainerClient(blobStorageSettingsData.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            const blobArrayBuffer = await file.arrayBuffer();
            const fileBuffer = Buffer.from(blobArrayBuffer);
            const uploadBlobResponse = await blockBlobClient.uploadData(fileBuffer);
            const formData = new FormData();
            const fileObject = { name: file.name, url: blockBlobClient.url, size: file.size};
            const isBlobFile = true;
            formData.append('file', JSON.stringify(fileObject));
            formData.append('isBlobFile', isBlobFile.toString());
            const apiEndpoint = `/api/files`;
            const response = await this.client.sendToBackend(formData, apiEndpoint, "POST", true);
            return response;
        }
        else {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const apiEndpoint = `/api/files`;
                const response = await this.client.sendToBackend(formData, apiEndpoint, "POST", true);
                return response;
            } catch (error) {
                console.log("Error uploading file:", error);
                throw error;
            }
        }

    }

    async getFile(file_name: string): Promise<AxiosResponse<any>> {
        try {
            const apiEndpoint = `/api/files?file_name=${file_name}`
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET", true);
            return response;
        } catch (error) {
            // Handle error`/
            console.log("Error getting file:", error);
            throw error;
        }
    }

    async getFileUrl(file_id: string): Promise<AxiosResponse<any>> {
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

    async getFileMetaData(id: string): Promise<AxiosResponse<any>> {
        try {
            const apiEndpoint = `/api/files/metadata?id=${id}`;
            const response = await this.client.sendToBackend({}, apiEndpoint, "GET");
            return response;
        } catch (error) {
            // Handle error
            console.log("Error getting file metadata:", error);
            throw error;
        }
    }

    async deleteFile(id: string): Promise<AxiosResponse<any>> {
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