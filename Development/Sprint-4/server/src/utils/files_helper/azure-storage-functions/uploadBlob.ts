import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";

export function uploadBlob(serviceName: string, serviceKey: string, containerName: string, file: File): BlobServiceClient {
    const sharedKeyCredential = new StorageSharedKeyCredential(
        serviceName,
        serviceKey
    );
    const blobServiceClient = new BlobServiceClient(
        `https://${serviceName}.blob.core.windows.net`,
        sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);



    return blobServiceClient;
}
