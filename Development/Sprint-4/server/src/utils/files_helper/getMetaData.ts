export async function getMetaData(id: string){
    try {
        const path = `./files-metadata/${id}.json`
        const file = Bun.file(path);

        const metaData = await file.json();
        return metaData;
    } catch (err:any) {
        console.error('Error reading Meta data:', err);
        throw err.message;
    }
}