// This function converts a ReadableStream to a Buffer.
export default async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        readableStream.on('data', (data: Buffer | string) => {
            const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
            chunks.push(content);
        });

        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });

        readableStream.on('error', reject);
    });
}