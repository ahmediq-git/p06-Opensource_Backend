import { Context, Hono } from "hono";
import { resolve } from "path";
import { v4 } from "uuid";
import { getCollection } from "@src/utils/getCollection";
import { createMetaData } from "@src/utils/files_helper/createMetaData";
import { getMetaData } from "@src/utils/files_helper/getMetaData";
import { unlink } from "node:fs/promises";
import { readFilesInDirectory } from "@src/utils/misc/readFilesInDirectory";
import getStorageAccountDetails from "@src/utils/files_helper/azure-storage-functions/getStorageAccountDetails";
import blobToString from "@src/utils/files_helper/azure-storage-functions/blobToString";
import streamToBuffer from "@src/utils/files_helper/azure-storage-functions/streamToBuffer";
import fs from "fs";
import {
  BlobServiceClient, StorageSharedKeyCredential, BlobDownloadResponseModel, BlobSASPermissions,
  ContainerClient, SASProtocol
} from '@azure/storage-blob';
import getGenerateSasToken from "@src/utils/files_helper/azure-storage-functions/sas";
import { generateSASUrl } from "@src/utils/files_helper/azure-storage";

const files = new Hono();


//post with file field in form data http://localhost:3690/api/files
files.post("/", async (c) => {
  try {

    const data = await c.req.formData();
    // check if there is a isBlobFile field in the form data
    if (data.has("isBlobFile")) {
      // const file = data.get("file");
      const file = JSON.parse(data.get("file") as string);
      console.log("FILE RECEIVED:", file);
      const id = v4().replaceAll('-', '').slice(0, 16);

      if (!file) throw new Error("No file provided in the `file` field");

      const dotIndex = (file.name).lastIndexOf('.');
      const fileExtension = file.name.slice(dotIndex + 1);
      const storageType = "Blob Storage";
      const metadata = createMetaData(file.url, file.name, `${id}.${fileExtension}`, id, file.size, storageType);
      await Bun.write(`./files-metadata/${id}.json`, JSON.stringify(metadata, null, 2));

      return c.json({
        error: null,
        data: id,
      });
    }
    else {
      const file = data.get("file");
      const id = v4().replaceAll('-', '').slice(0, 16);

      if (!file) throw new Error("No file provided in the `file` field");

      const dotIndex = (file.name).lastIndexOf('.');
      const fileExtension = file.name.slice(dotIndex + 1);

      // obtaining the url of where the service is running
      const config = getCollection('config')
      const appConfig: any = await new Promise((resolve, reject) => {
        config.findOne({}, function (err: any, docs: any) {
          if (err) {
            reject(err);
          }
          resolve(docs);
        });
      });

      if (!appConfig) throw new Error("Failed to get appConfig");

      let bytes_written = await Bun.write(`./files/${id}.${fileExtension}`, file);

      if (bytes_written > 0) {
        const file_url = `${appConfig.application.url}/api/files?file_name=${id}.${fileExtension}`
        const storageType = "Local Storage";
        const metadata = createMetaData(file_url, file.name, `${id}.${fileExtension}`, id, bytes_written, storageType)

        await Bun.write(`./files-metadata/${id}.json`, JSON.stringify(metadata, null, 2));
        return c.json({
          error: null,
          data: id,
        });
      } else {
        throw new Error("Failed to write file to disk");
      }
    }

  } catch (error: any) {
    console.log(error);
    return c.json({ error: error.message, data: null }, 500);
  }
});

//http://localhost:3690/api/files?file_name=
files.get("/", async (c: Context) => {
  try {
    const params = c.req.query();

    const { file_name } = params as {
      file_name: string;
    };

    if (file_name) {
      let path = resolve(`./files/${file_name}`);
      return new Response(Bun.file(path));
    }
    return c.json({
      error: "File does not exist",
      data: null,
    }, 404);
  } catch (error) {

    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    }, 500);

  }

});

files.get("/filecontent", async (c: Context) => {

  try {
    const params = c.req.query();

    const { id } = params as {
      id: string;
    };

    if (id) {
      const metadata = await getMetaData(id);

      if (metadata.storageType === "Local Storage") {
        let path = resolve(`./files/${metadata.stored_name}`);
        const fileBuffer = fs.readFileSync(path);
        const fileBase64 = fileBuffer.toString('base64');
        return c.json({
          error: null,
          data: fileBase64,
        });

      }
      else if (metadata.storageType === "Blob Storage") {
        const blobStorageDetails = await getStorageAccountDetails();
        const account = blobStorageDetails.serviceName;
        const accountKey = blobStorageDetails.serviceKey;
        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const containerName = blobStorageDetails.containerName;
        const blobName = metadata.name;
        const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadBlockBlobResponse: BlobDownloadResponseModel = await blobClient.download();

        if (!downloadBlockBlobResponse.errorCode && downloadBlockBlobResponse.readableStreamBody) {
          const downloaded = await streamToBuffer(
            downloadBlockBlobResponse.readableStreamBody
          );
          if (downloaded) {
            const fileBase64 = downloaded.toString('base64');
            return c.json({
              error: null,
              data: fileBase64,
            });
          }
          else {
            return c.json({
              error: "Error downloading the file",
              data: null,
            }, 500);
          }
        }
        else {
          return c.json({
            error: "Error downloading the file: " + downloadBlockBlobResponse.errorCode,
            data: null,
          }, 500);
        }

      }

    }
    return c.json({
      error: "File does not exist",
      data: null,
    }, 404);
  }

  catch (error) {
    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    }, 500);
  }

});

// return file
//// http://localhost:3690/api/files/url?id=
files.get("/url", async (c: Context) => {
  try {
    const params = c.req.query();
    const { id } = params as { id: string };
    console.log(id)
    if (id) {
      const meta = await getMetaData(id)
      return c.json({
        error: null,
        data: meta?.link
      })
    }
    return c.json({
      error: "File does not exist",
      data: null,
    }, 404);

  } catch (error: any) {
    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    }, 500);
  }
})


// return meta data of a file
// http://localhost:3690/api/files/metadata?id=
files.get("/metadata", async (c: Context) => {
  try {
    const params = c.req.query();

    const { id } = params as {
      id: string;
    };

    if (id) {
      const meta = await getMetaData(id)
      return c.json({
        error: null,
        data: meta
      })
    }
    return c.json({
      error: "File does not exist",
      data: null,
    }, 404);
  } catch (error) {

    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    }, 500);

  }
})

// http://localhost:3690/api/files/:id
files.delete("/:id", async (c: Context) => {
  try {
    const { id } = c.req.param();
    const meta = await getMetaData(id)

    await unlink(`./files/${meta.stored_name}`);
    await unlink(`./files-metadata/${id}.json`);

    return c.json({
      error: null,
      data: `Deletion of the file with id ${id} successful`,
    });
  } catch (error) {
    console.log(error);
    return c.json({
      error: "Error deleting the file",
      data: null,
    });
  }
})


// get all files meta data in an array
files.get("/list", async (c: Context) => {
  try {

    const meta_data_file_names = readFilesInDirectory('files-metadata')
    let ids = meta_data_file_names.map(meta_data_file => meta_data_file.replace(".json", ""));

    let meta_data_files = []

    await Promise.all(ids.map(async (id) => {
      try {
        const meta = await getMetaData(id);
        meta_data_files.push(meta);
      } catch (error) {
        console.error(`Error fetching metadata for ID ${id}:`, error);
      }
    }));

    return c.json({
      error: null,
      data: meta_data_files,
    });

  } catch (error) {
    return c.json({
      error: "Error Listing files",
      data: null,
    });
  }
})

files.get("/file_settings", async (c: Context) => {
  try {
    const blobStorageDetails = await getStorageAccountDetails();
    return c.json({
      error: null,
      data: blobStorageDetails,
    });
  }
  catch (error) {
    return c.json({
      error: "Error fetching file settings",
      data: null,
    });
  }
})

files.post("/sas", async (c: Context) => {
  console.log("Generating SAS URL for file");
  try {
    const blobStorageDetails = await getStorageAccountDetails();
    if (!(blobStorageDetails.useBlobStorage)) {
      return c.json({
        error: true,
        data: "Blob storage is not enabled"
      });
    }

    const fileName = c.req.query('file') || 'nonamefile';
    const permissions = c.req.query('permission') || 'w';
    const timerange = parseInt(c.req.query('timerange') || '10'); // 10 minutes by default
    const containerName = blobStorageDetails.containerName || 'anonymous';

    if (!fileName) {
      console.log("No file name provided", fileName);
      return c.json({
        error: true,
        data: "No file name provided"
      });
    }

    console.log("Account Name:", blobStorageDetails.serviceName);
    console.log("Account Key:", blobStorageDetails.serviceKey)
    console.log("containerName:", blobStorageDetails.containerName);
    console.log("fileName:", fileName);
    console.log("permissions:", permissions);
    console.log("timerange:", timerange);

    // print the type of each variable to be passed
    console.log("Type of Account Name:", typeof blobStorageDetails.serviceName);
    console.log("Type of Account Key:", typeof blobStorageDetails.serviceKey)
    console.log("Type of containerName:", typeof blobStorageDetails.containerName);
    console.log("Type of fileName:", typeof fileName);
    console.log("Type of permissions:", typeof permissions);
    console.log("Type of timerange:", typeof timerange);

    console.log("Generating SAS URL for file", fileName);
    // const sasUrl = await generateSASUrl(
    //   blobStorageDetails.serviceName,
    //   blobStorageDetails.serviceKey,
    //   containerName,
    //   file,
    //   permissions,
    //   timerange
    // );
    const account = blobStorageDetails.serviceName;
    const accountKey = blobStorageDetails.serviceKey;
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    console.log("sharedKeyCredential", sharedKeyCredential);
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
    console.log("blobServiceClient", blobServiceClient);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log("containerClient", containerClient);
    const blockBlobClient = containerClient.getBlobClient(fileName);
    console.log("blockBlobClient", blockBlobClient);
    // Best practice: create time limits
    const SIXTY_MINUTES = timerange * 60 * 1000;
    const NOW = new Date();

    // Create SAS URL
    const accountSasTokenUrl = await blockBlobClient.generateSasUrl({
      startsOn: NOW,
      expiresOn: new Date(new Date().valueOf() + SIXTY_MINUTES),
      permissions: BlobSASPermissions.parse(permissions), // Read only permission to the blob
      protocol: SASProtocol.Https // Only allow HTTPS access to the blob
    });


    return c.json({
      error: false,
      data: accountSasTokenUrl
    });
  }
  catch (err) {
    console.log("Error:", err);
    return c.json({
      error: true,
      data: err
    });
  }
});

export default files;
