export function createMetaData(file_path: string, file_name:string, stored_name: string, file_id: string, file_size: number){
    // returns a object of the given file with the properties
    // id, name, file type, size, link, createdAt, hash
    
    const file = Bun.file(file_path)

    const fileData = {
        _id: file_id,
        name: file_name, // this is file name specified by user, not how it is stored 
        stored_name: stored_name,
        type: file.type,
        createdAt:new Date().toISOString(),
        size: file_size,
        link: file_path, // this is the file path of the file as it is stored, not as bun accesses it with get
    }

    return fileData
}