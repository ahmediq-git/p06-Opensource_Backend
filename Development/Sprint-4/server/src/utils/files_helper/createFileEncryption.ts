export async function createFileEncryption(password: string, file_name: string, file_id: string) {
    // creates a file encryption object
    // returns the object
    const hashedpassword = await Bun.password.hash(password);
    const fileEncryption = {
        _id: file_id,
        file_name: file_name,
        password: hashedpassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    // console.log("fileEncryption:", fileEncryption)
    return fileEncryption
}