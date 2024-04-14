// checks permission for if operation allowed
export function checkPermissions(collectionName: string, crudOperation: string, RulesMemoryObject: any): boolean {
    const permission=RulesMemoryObject?.[collectionName]?.[crudOperation]

    if (permission === undefined) {
        return false
    }
    return permission
}