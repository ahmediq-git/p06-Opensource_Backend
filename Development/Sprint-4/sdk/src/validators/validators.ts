// This contains all the validation functions to ensure everything is in the right format on entry

class ValidationUtils {
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    static isValidEmail(email: string): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    static isObject(userInput: any): boolean {
        return typeof userInput === 'object' && userInput !== null && !Array.isArray(userInput);
    }

    static isSingleKeyValuePair(obj: any): boolean {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length === 1;
    }

    static isString(userInput: any): boolean {
        return typeof userInput === 'string';
    }

    static isBoolean(userInput: any): boolean {
        return typeof userInput === 'boolean';
    }

    static isArrayOfObjects(userInput: any): boolean {
        return Array.isArray(userInput) && userInput.every(item => typeof item === 'object' && item !== null);
    }

    // Helper function to convert from array of objects to object of objects
    static objectFromArrayOfObjects(arrayOfObjects: any[]): { [key: string]: any } {
        const objectFromArrayOfObjects: { [key: string]: any } = {};
        arrayOfObjects.forEach((obj, index) => {
            objectFromArrayOfObjects[index.toString()] = obj;
        })

        return objectFromArrayOfObjects;
    }
}

export default ValidationUtils;
