interface RuleObject {
    [key: string]: {
        [key: string]: boolean;
    };
}

interface RulePermissions {
    [key: string] : boolean
}

// takes auth object meta data and collection for which we need to evaluate rule, and for that given collection returns the dictionary corresponding to the rules of that collection
function getCollectionPermissions(authMetaData: any, collectionName: string, userRules: any, defaultRules: any): RulePermissions {

    // check if the collection exists for rule checking
    if (userRules.hasOwnProperty(collectionName)) {
        const rulesForCollection = userRules[collectionName];

        for (const ruleNumber in rulesForCollection) {
            const condition = rulesForCollection[ruleNumber];

            let skipRule = false

            let ruleResult = false //required for evaluating the rule statement

            // traversing each condition in a rule
            let logicToNext= 'none' // used as glue to the next boolean condition
            for (let i = 0; i < condition.length-1; i++) {
                

                // check if Var is in keys of auth metadata, or if the operator is 'in/not in' then you check whether 'value' is in authMetaData as 'left in right'
                if (condition[i][0] in authMetaData || (condition[i][2] in authMetaData && ((condition[i][1]==='in')||(condition[i][1]==='not in')))) {
                    const [key, operator, value, logic] = condition[i];
                    
                        switch (operator) {
                            case 'eq':
                                
                                if (i===0){
                                    // i is first value
                                    ruleResult = ruleResult || (authMetaData[key] === value)
                                } else {
                                    // i is last value
                                    ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[key] === value)) : (ruleResult || (authMetaData[key] === value));
                                }
                                
                                break;
                            case 'in':
                                // remember 'in' will be reverse of the other statements
                                if (value in authMetaData){
                                    
                                    if (Array.isArray(authMetaData[value])) {
                                        if (i==0){
                                            ruleResult = ruleResult || (authMetaData[value].includes(key))
                                        } else {
                                            ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[value]).includes(key)) : (ruleResult || (authMetaData[value].includes(key)));
                                        }
                                    } else {
                                        // becomes false if invalid use of in and the given value is not an array
                                        ruleResult = false
                                    }
                                } else{
                                    ruleResult = false
                                }

                                break;
                            case 'not in':
                                if (value in authMetaData){
                                    
                                    if (Array.isArray(authMetaData[value])) {
                                        if (i==0){
                                            ruleResult = ruleResult || !(authMetaData[value].includes(key))
                                        } else {
                                            ruleResult = logicToNext === 'and' ? (ruleResult && !(authMetaData[value]).includes(key)) : (ruleResult || !(authMetaData[value].includes(key)));
                                        }
                                    } else {
                                        // becomes false if invalid use of not in and the given value is not an array
                                        ruleResult = false
                                    }
                                } else {
                                    ruleResult=false
                                }

                                break
                            case 'neq':

                                if (i==0){
                                    ruleResult = ruleResult || (authMetaData[key] !== value)
                                } else {
                                    ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[key] !== value)) : (ruleResult || (authMetaData[key] !== value));
                                }
                                break
                            case '>':

                                if (i==0){
                                    ruleResult = ruleResult || (authMetaData[key] > value)
                                } else {
                                   
                                    ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[key] > value)) : (ruleResult || (authMetaData[key] > value));
                                }
                                break;
                            case '<':
                                if (i==0){
                                    ruleResult = ruleResult || (authMetaData[key] < value)
                                } else {
                                    ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[key] < value)) : (ruleResult || (authMetaData[key] < value));
                                }
                                break;
                            case '>=':
                                if (i==0){
                                    ruleResult = ruleResult || (authMetaData[key] >= value)
                                } else {
                                    ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[key] >= value)) : (ruleResult || (authMetaData[key] >= value));
                                }
                                break
                            case '<=':
                                if (i==0){
                                    ruleResult = ruleResult || (authMetaData[key] <= value)
                                } else {
                                    ruleResult = logicToNext === 'and' ? (ruleResult && (authMetaData[key] <= value)) : (ruleResult || (authMetaData[key] <= value));
                                }
                                break
                            default:
                                // Handle invalid operators or unknown cases
                                break;
                        }
                    

                    logicToNext = logic
                    

                } else {
                    // we skip rule if we find the current rule contains a field that does not exist in the authMetaData collection
                    skipRule = true
                    break
                }
                
            }

            // if a key is not in auth meta data then we skip that rule as it doesnt apply to current user
            if (skipRule) {
                continue
            }

            if (ruleResult) {
                // return the CRUD permisisons if rule true    
               return condition[condition.length - 1] 
            }
        
        
        }

        return defaultRules[collectionName]
        

    } else {
        return {}  //if collection doesnt exist, there is no  rules for it
    }
}


// constructs the memory object from the received rules
export function constructRulesMemoryObject(authMetaData:any, userRules: any, defaultRules: any): RuleObject {
    if (Object.keys(userRules).length === 0) {
        return {}
    }

    let ruleObject: RuleObject = {}

    for (const collection in userRules) {
        ruleObject[collection]=getCollectionPermissions(authMetaData, collection, userRules, defaultRules)
    }

    return ruleObject
}
