import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { generateSASUrl } from '@src/utils/files_helper/azure-storage';
import getStorageAccountDetails from "@src/utils/files_helper/azure-storage-functions/getStorageAccountDetails";

export default async function getGenerateSasToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const blobStorageDetails = await getStorageAccountDetails();
    if (
      !blobStorageDetails.serviceName ||
      !blobStorageDetails.serviceKey
    ) {
      return {
        status: 405,
        jsonBody: 'Missing required app configuration'
      };
    }

    const containerName = blobStorageDetails.containerName || 'anonymous';
    const fileName = request.query.get('file') || 'nonamefile';
    const permissions = request.query.get('permission') || 'w';
    const timerange = parseInt(request.query.get('timerange') || '10'); // 10 minutes

    console.log(`containerName: ${containerName}`);
    console.log(`fileName: ${fileName}`);
    console.log(`permissions: ${permissions}`);
    console.log(`timerange: ${timerange}`);

    const url = await generateSASUrl(
      blobStorageDetails.serviceName,
      blobStorageDetails.serviceKey,
      containerName,
      fileName,
      permissions
    );

    return {
      jsonBody: {
        url
      }
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: error
    };
  }
}

app.http('sas', {
  methods: ['POST', 'GET'],
  authLevel: 'anonymous',
  handler: getGenerateSasToken
});
