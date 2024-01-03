// This contains all the validation functions to ensure everything is in the right format on entry

class ValidationUtils {
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    static isObject(userInput) {
        return typeof userInput === 'object' && userInput !== null && !Array.isArray(userInput);
    }

    static isSingleKeyValuePair(obj) {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length === 1;
    }

    static isString(userInput) {
        return typeof userInput === 'string';
    }

    static isArrayOfObjects(userInput) {
        return Array.isArray(userInput) && userInput.every(item => typeof item === 'object' && item !== null);
    }

    // Helper function to convert from array of objects to object of objects
    static objectFromArrayOfObjects(arrayOfObjects) {
        const objectFromArrayOfObjects = {};
        arrayOfObjects.forEach((obj, index) => {
            objectFromArrayOfObjects[index.toString()] = obj;
        })

        return objectFromArrayOfObjects
    }
}

export default ValidationUtils;