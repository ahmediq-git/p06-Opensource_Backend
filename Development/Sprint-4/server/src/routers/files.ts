import { Context, Hono } from "hono";
import { resolve } from "path";
import { parse, v4 } from "uuid";
import { getCollection } from "@src/utils/getCollection";
import { createMetaData } from "@src/utils/files_helper/createMetaData";
import { createFileEncryption } from "@src/utils/files_helper/createFileEncryption";
import { getMetaData } from "@src/utils/files_helper/getMetaData";
import { unlink } from "node:fs/promises";
import { readFilesInDirectory } from "@src/utils/misc/readFilesInDirectory";
import getStorageAccountDetails from "@src/utils/files_helper/azure-storage-functions/getStorageAccountDetails";
import { uploadBlob } from "@src/utils/files_helper/azure-storage";
import { generateSASUrl } from "@src/utils/files_helper/azure-storage";
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { v4 as uuidv4 } from "uuid";



const files = new Hono();


//post with file field in form data http://localhost:3690/api/files
files.post("/", async (c) => {
  try {

    const blobStorageDetails = await getStorageAccountDetails();
    // if (blobStorageDetails.useBlobStorage) {
    //   console.log("Blob Storage is enabled:");
    //   console.log(blobStorageDetails);
    // }

    const data = await c.req.formData();
    // print the form data
    console.log("Form Data Received:", data);
    const file = data.get("file") as File;
    const password = data.get("password") as string;
    const id = v4().replaceAll('-', '').slice(0, 16);

    if (!file) throw new Error("No file provided in the `file` field");

    const dotIndex = (file.name).lastIndexOf('.');
    const fileExtension = file.name.slice(dotIndex + 1);

    // if (blobStorageDetails.useBlobStorage) {

    //   const blobArrayBuffer = await file.arrayBuffer();
    //   const fileBuffer = Buffer.from(blobArrayBuffer);

    //   const sharedKeyCredential = new StorageSharedKeyCredential(blobStorageDetails.serviceName, blobStorageDetails.serviceKey);
    //   const blobServiceClient = new BlobServiceClient(
    //     `https://${blobStorageDetails.serviceName}.blob.core.windows.net`,
    //     sharedKeyCredential
    //   );

    //   const containerClient = blobServiceClient.getContainerClient(blobStorageDetails.containerName);
    //   const blobName = `${uuidv4()}-${file.name}`;
    //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    //   await blockBlobClient.uploadData(fileBuffer, {
    //     blobHTTPHeaders: { blobContentType: file.type }
    //   });

    //   const file_url = blockBlobClient.url;
    //   const metadata = createMetaData(file_url, file.name, `${id}.${fileExtension}`, id, file.size);

    //   await Bun.write(`./files-metadata/${id}.json`, JSON.stringify(metadata, null, 2));

    //   return c.json({
    //     error: false,
    //     data: id,
    //   });

    // }

    // if (blobStorageDetails.useBlobStorage) {
    //   console.log("UPLOADING FILE TO  BLOB STORAGE...");
    //   const blobArrayBuffer = await file.arrayBuffer();
    //   const fileBuffer = Buffer.from(blobArrayBuffer);

    //   // upload to azure blob storage
    //   // const response = await uploadBlob(
    //   //   blobStorageDetails.serviceName,
    //   //   blobStorageDetails.serviceKey,
    //   //   `${id}.${fileExtension}`,
    //   //   blobStorageDetails.containerName,
    //   //   blob
    //   // );

    //   const fileName = id + fileExtension;
    //   const blobServiceClient = new BlobServiceClient(
    //     `https://${blobStorageDetails.serviceName}.blob.core.windows.net`,
    //     blobStorageDetails.serviceKey
    //   );
    //   const containerClient = blobServiceClient.getContainerClient(blobStorageDetails.containerName);
    //   const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    //   const response = await blockBlobClient.uploadData(fileBuffer, { blobHTTPHeaders: { blobContentType: 'text/plain' } });

    //   // if (response?.error) {
    //   //   throw new Error(`Failed to upload file to blob storage: ${response}`);
    //   // }

    //   if (response._response.status === 200) {
    //     console.log('File uploaded successfully', response._response.request.url);
    //   }

    //   // const file_url = response?.url;
    //   const file_url = 'www.google.com'

    //   const metadata = createMetaData(file_url, file.name, `${id}.${fileExtension}`, id, file.size);

    //   await Bun.write(`./files-metadata/${id}.json`, JSON.stringify(metadata, null, 2));

    //   return c.json({
    //     error: false,
    //     data: id,
    //   });
    // }


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
      const metadata = createMetaData(file_url, file.name, `${id}.${fileExtension}`, id, bytes_written);
      if (password.length > 0) {
        const encryption = await createFileEncryption(password, `${id}.${fileExtension}`, id);
        console.log("Encryption:", encryption);
        try {
          await Bun.write(`./files-encryption/${id}.json`, JSON.stringify(encryption, null, 2));
        }
        catch (err) {
          console.log("Failed to write encryption file to disk", err);
        }
      }
      await Bun.write(`./files-metadata/${id}.json`, JSON.stringify(metadata, null, 2));

      return c.json({
        error: false,
        data: id,
      });
    } else {
      throw new Error("Failed to write file to disk");
    }


  } catch (err) {
    console.log(err)
    return c.json({ error: err, data: null });
  }

});

files.post("/sas", async (c: Context) => {
  console.log("Generating SAS URL for file");
  try {
    const blobStorageDetails = await getStorageAccountDetails();
    console.log("Blob Storage is enabled:", blobStorageDetails);
    if (!(blobStorageDetails.useBlobStorage)) {
      return c.json({
        error: true,
        data: "Blob storage is not enabled"
      });
    }

    const file = c.req.query('file');
    const permissions = c.req.query('permission') || 'w';
    const timerange = parseInt(await c.req.json()) || 1;

    if (!file) {
      console.log("No file name provided", file);
      return c.json({
        error: true,
        data: "No file name provided"
      });
    }

    console.log("Account Name:", blobStorageDetails.serviceName);
    console.log("Account Key:", blobStorageDetails.serviceKey)
    console.log("containerName:", blobStorageDetails.containerName);
    console.log("fileName:", file);
    console.log("permissions:", permissions);
    console.log("timerange:", timerange);

    // print the type of each variable to be passed
    console.log("Type of Account Name:", typeof blobStorageDetails.serviceName);
    console.log("Type of Account Key:", typeof blobStorageDetails.serviceKey)
    console.log("Type of containerName:", typeof blobStorageDetails.containerName);
    console.log("Type of fileName:", typeof file);
    console.log("Type of permissions:", typeof permissions);
    console.log("Type of timerange:", typeof timerange);

    console.log("Generating SAS URL for file", file);
    const sasUrl = await generateSASUrl(
      blobStorageDetails.serviceName,
      blobStorageDetails.serviceKey,
      blobStorageDetails.containerName,
      file,
      permissions
    );

    return c.json({
      error: false,
      data: sasUrl
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
      error: true,
      data: null,
    });
  } catch (error) {

    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    });

  }

});

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
        error: false,
        data: meta
      })
    }
    return c.json({
      error: true,
      data: null,
    });
  } catch (error) {

    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    });

  }
})

// http://localhost:3690/api/files/:id
files.delete("/:id", async (c: Context) => {
  try {
    const { id } = c.req.param();
    console.log(id)
    const meta = await getMetaData(id)

    await unlink(`./files/${meta.stored_name}`);
    await unlink(`./files-metadata/${id}.json`);

    return c.json({
      error: false,
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
      error: false,
      data: meta_data_files,
    });

  } catch (error) {
    return c.json({
      error: "Error Listing files",
      data: null,
    });
  }
})

export default files;
