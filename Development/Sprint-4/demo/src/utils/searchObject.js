const searchObject = (list, searchKey, searchValue) => {
    for (const obj of list) {
        if (obj.hasOwnProperty(searchKey) && obj[searchKey] === searchValue) {
            return obj;
        }
    }
    return null;
};

export {
    searchObject
}

