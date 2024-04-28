export default async function blobToString(blob: Blob): Promise<string> {
    const fileReader: FileReader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        fileReader.onloadend = () => {
            resolve(fileReader.result as string);
        };
        fileReader.onerror = () => {
            reject(fileReader.error);
        };
        fileReader.readAsText(blob);
    });
}