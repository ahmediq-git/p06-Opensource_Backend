import SideRail from "../components/SideRail"
import { useState, useCallback, useMemo, useEffect} from 'react'
import { MinusCircle, PlusCircle } from "lucide-react";

export default function RulesPage() {
    const [activeState, setActiveState] = useState('rules');
  
    // get all the User table rules
    const [userRules, setUserRules] = useState({});

    //get all the default table rules
    const [defaultRuleObject, setDefaultRuleObject] = useState({}) 

    const handleSubmitRules = () => {
        const userDefinedRules = userRules
        const defaultDefinedRuleObject = defaultRuleObject
        submitRulesToBackend(userDefinedRules, defaultDefinedRuleObject);
    };

     // default select the first collection
     const [selectedCollection, setSelectedCollection] = useState(Object.keys(userRules)[0]);

   

     const submitRulesToBackend = async (userRules, defaultRuleObject) => {
        try {
            // Combine userRules and defaultRuleObject into a single object
            const combinedRules = {
                userRules,
                defaultRuleObject
            };

    
            // Make an API call to submit rules to the backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rules/update_rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedRules),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit rules to the backend');
            }
    
            // Handle success response
            console.log('Rules submitted successfully');
            // You may perform further actions upon successful submission
        } catch (error) {
            console.error('Error submitting rules:', error);
            // Handle error scenario
        }
    };
    

    // getting the rules from backend on request
    useEffect(()=>{
    const fetchRulesFromBackend = async () => {
        try {
            // Make an API call to fetch rules from the backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rules/get_rules`);
    
            if (!response.ok) {
                throw new Error('Failed to fetch rules from the backend');
            }
            
            // Parse the response
            const rules = await response.json();

            if (!rules) throw new Error("Failed fetch rules")
            
            // console.log(rules.data.userRules)
            // console.log(rules.data.defaultRuleObject)
            // Update state with fetched rules
            setUserRules(rules.data.userRules);
            setDefaultRuleObject(rules.data.defaultRuleObject);
            setSelectedCollection(Object.keys(rules.data.userRules)[0])

            // console.log(userRules)
            // console.log(defautRuleObject)
    
            console.log('Rules fetched successfully:', rules);
        } catch (error) {
            console.error('Error fetching rules:', error);
            // Handle error scenario
        }
    };

    fetchRulesFromBackend()
    },[])

    useEffect(()=>{
        console.log(userRules)
        console.log(defaultRuleObject)
     },[userRules, defaultRuleObject])

    // Adds rule for user
    const addRule = useCallback((collection) => {
        setUserRules(prevRules => {
            const keys = Object.keys(prevRules[collection]);
            const newKey = keys.length > 0 ? String(parseInt(keys[keys.length - 1]) + 1) : '1';
    
            return {
                ...prevRules,
                [collection]: {
                    ...prevRules[collection],
                    [newKey]: [['', 'eq', '', 'None'], {
                        createCollection: false,
                        deleteCollection: false,
                        createRecord: false,
                        readRecord: false,
                        updateRecord: false,
                        deleteRecord: false,
                    }]
                }
            };
        });
    }, [setUserRules]);

    // removes rule for user
    const removeRule = (collection, keyToRemove) => {
        if (userRules[collection] && userRules[collection][keyToRemove]) {
            const updatedRules = { ...userRules };
            delete updatedRules[collection][keyToRemove];
            // Reorganize keys
            const keys = Object.keys(updatedRules[collection]);
            keys.sort((a, b) => parseInt(a) - parseInt(b)); // Sort keys numerically
            const newRules = {};
            keys.forEach((key, index) => {
                newRules[(index + 1).toString()] = updatedRules[collection][key];
            });
            updatedRules[collection] = newRules;
            setUserRules(updatedRules);
        }
    };
    

   
    // used to select the given collection
    const handleCollectionChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedCollection(selectedValue);
    };



    return (
        <div className="flex bg-neutral-950 text-gray-50 h-screen max-h-screen overflow-y-scroll relative"> {/* Set relative positioning */}
            {/* side bar */}
            <SideRail setActiveState={setActiveState} />
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>

            <div className="flex-1 relative overflow-y-scroll">
                <div className="w-full h-screen flex flex-col">
                    {/* heading */}
                    <div className="p-4 mb-2 text-2xl gap-2 flex justify-between w-full backdrop-blur-lg z-20 border-b border-gray-100 border-opacity-10 sticky top-0 bg-opacity-100 bg-[#161616]">
                        <div className="flex gap-2 grow bg-opacity-75 justify-between" >
                            <span className="text-white-100 text-opacity-25">
                                Role Based Authorization
                            </span>
                            
                            {Object.keys(userRules).length !== 0 ?
                            (<button type="button" className="text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-green-400 font-small rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400 transition-transform transform hover:scale-105 active:scale-90" onClick={handleSubmitRules}>Save Rules</button>)
                            : (<div></div>)}
       

                        </div>

                    </div>
                    {/* display the User Table and Default table only if collections exist and are created */}
                    {Object.keys(userRules).length !== 0 ?
                        (<div>
                            <div className="m-1 ml-4  mr-4">
                                <div className="flex">
                                    <div className="flex-grow">
                                        <h2 className="text-xl font-semibold text-white mb-3 ml-1 mt-1">User Table</h2>
                                    </div>
                                    <div className="flex flex-row w-[250px] mb-2">
                                        <label htmlFor="opDropdown" className="block text-sm font-medium text-gray-100 mb-0.5 mt-3 mr-2">Collection</label>
                                        <select className="input w-full mr-2" id="opDropdown" onChange={handleCollectionChange}>
                                            {Object.keys(userRules).map((col, index) => (
                                                <option key={index}>{col}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <ReturnUserRuleTable collectionName={selectedCollection} collectionRules={userRules} setUserRules={setUserRules} addRule={addRule} removeRule={removeRule} />
                            </div>

                            <div className="m-4">
                                <h2 className="text-xl font-semibold text-white mb-4 ml-1">Default Table</h2>
                                <ReturnDefaultTable collectionName={selectedCollection} defaultRuleObject={defaultRuleObject} setDefaultRuleObject={setDefaultRuleObject}/>
                            </div>
                        </div>) : (<div className="flex flex-col justify-center items-center gap-2 w-full h-full">
                            <h2 className="text-2xl">No Collections created</h2>
                            <p className="text-gray-500">
                                Create a collection to view its rules
                            </p>
                        </div>)}
                </div>
            </div>
        </div>
    )
}


// function that get rules of this table
function ReturnUserRuleTable({ collectionName, collectionRules, addRule, removeRule, setUserRules }) {
    console.log(collectionRules, collectionName)
    const [numRules, setNumRules] = useState(Object.keys(collectionRules[collectionName]).length) //number of rules will be the row span

    // memoise setting of rules as its expensive
    useMemo(() => {
      setNumRules(Object.keys(collectionRules[collectionName]).length);
    },   [collectionName, collectionRules]);

    // Function to handle changes in Bool dropdown so or/and adds new record, None eliminates extra records
  const handleBoolChange = (collection, index, key, condition_index, value) => {
    if (value === 'None') {
        // If 'None' is selected, remove all consequent entries
        handleChange(collection, index, key, condition_index, 'None')
        setUserRules(prevEntries => {
            const updatedRules = { ...prevEntries };
            
            const totalRule = updatedRules[collection][key]
            const lastElement = totalRule[totalRule.length-1]
            const splicedArray = totalRule.splice(0, index+1)

            splicedArray.push(lastElement)

            updatedRules[collection][key] = splicedArray

            return updatedRules


        }

        );

    } else if (value === 'and' || value === 'or') {
        // If 'and' or 'or' is selected, add another form entry inheriting values from the current entry
        
        handleChange(collection, index, key, condition_index, value)
        

            setUserRules(prevEntries => {
                const updatedRules = { ...prevEntries };
                
                if (index === updatedRules[collection][key].length-2){
                    const totalRule = updatedRules[collection][key]
                    // console.log(totalRule)
                    const lastElement = totalRule[totalRule.length-1]
                    const splicedArray = totalRule.splice(0, index+1)
                    const newEntry = ['', 'eq', '', 'None']
                    splicedArray.push(newEntry, lastElement)

                    updatedRules[collection][key] = splicedArray
                }
                return updatedRules


            })
        }
        
        
    }


    // handles change of rules in form
    const handleChange = (collection, index, key, condition_index, value) => {
        setUserRules(prevRules => {
            const updatedRules = { ...prevRules };
            updatedRules[collection][key][index][condition_index] = value;
            return updatedRules;
        });
    };

//   to change value of buttons
    const handleButtonChange = useCallback((collection, key, operation) => {
        setUserRules(prevRules => {
            return {
                ...prevRules,
                [collection]: {
                    ...prevRules[collection],
                    [key]: prevRules[collection][key].map((item, index) => {
                        if (index === prevRules[collection][key].length - 1) {
                            return {
                                ...item,
                                [operation]: !item[operation]
                            };
                        }
                        return item;
                    })
                }
            };
        });
    }, [setUserRules]);
    
   

    // buttons for crud
    return (<div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
            <thead className="text-md  uppercase text-gray-300  bg-zinc-800">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Collection Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Rules
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody className="text-md">

            {Object.entries(collectionRules[collectionName]).map(([key, value]) => (
                
                <tr className="" key={key}>
                    {key === '1' ?
                    (<th scope="row" rowSpan={numRules} className="px-14 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {collectionName}
                    </th>) : (<div></div>)}
                    
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex flex-col">
                        
                        <div className="flex-col" id="SingleRule">

                            <div className="flex flex-row justify-between">
                                <div className='text-gray-100 ml-1'>
                                    Rule {key}
                                </div>
                                {numRules !==1?
                                <button
                                    className=" text-gray-200 flex gap-2"
                                    onClick={() => removeRule(collectionName, key)}
                                >
                                    <MinusCircle />
                                </button> : <div></div>
                                }
                            </div>

                            <div>
                                {value.slice(0,-1).map((entry, index) => (
                                    // console.log(value)
                                    <div key={index} className="flex">
                                        <div className="flex flex-col m-2">
                                            <label htmlFor={`VarInput_${index}`} className="block text-sm font-medium text-gray-100 mb-0.5">Var</label>
                                            <input id={`VarInput_${index}`} type="text" className="input" placeholder="Enter Variable" value={entry[0]} onChange={e => handleChange(collectionName, index, key, 0, e.target.value)} />
                                        </div>

                                        <div className="flex flex-col m-2 w-[100px]">
                                            <label htmlFor={`opDropdown_${index}`} className="block text-sm font-medium text-gray-100 mb-0.5">Op</label>
                                            <select className="input w-full" id={`opDropdown_${index}`} value={entry[1]} onChange={e => handleChange(collectionName, index, key, 1, e.target.value)}>
                                                <option value="eq">eq</option>
                                                <option value="neq">neq</option>
                                                <option value="in">in</option>
                                                <option value="not in">not in</option>
                                                <option value="<">{'<'}</option>
                                                <option value=">">{'>'}</option>
                                                <option value=">=">{'>='}</option>
                                                <option value="<=">{'<='}</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col m-2">
                                            <label htmlFor={`fieldInput_${index}`} className="block text-sm font-medium text-gray-100 mb-0.5">Field</label>
                                            <input id={`fieldInput_${index}`} type="text" className="input" placeholder="Enter Field" value={entry[2]} onChange={e => handleChange(collectionName, index, key, 2, e.target.value)} />
                                        </div>

                                        <div className="flex flex-col m-2 w-[100px]">
                                            <label htmlFor={`boolDropdown_${index}`} className="block text-sm font-medium text-gray-100 mb-0.5">Bool</label>
                                            <select className="input w-full" id={`boolDropdown_${index}`} value={entry[3]} onChange={e => handleBoolChange(collectionName, index, key, 3, e.target.value)}>
                                                <option value="None">None</option>
                                                <option value="and">and</option>
                                                <option value="or">or</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                           
                        </div>

                    { key===Object.keys(collectionRules[collectionName])[Object.keys(collectionRules[collectionName]).length-1] ?
                    (<button className="ml-2 mt-8 p-4 text-gray-200 flex w-44 gap-2 btn"
                     onClick={()=>addRule(collectionName)}
                    >
                        
                        <PlusCircle/>
                        <div>Create New Rule</div>
                    </button>) : (<div></div>)
                    }


                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                        <div className="flex mb-2 mt-2.5 text-gray-300">
                            <div className="pr-14 pl-0.5">Collections</div>
                            <div>Documents</div>
                        </div>
                        <div className="flex">
                            <button
                                className={`w-8 h-8 mx-1 ${collectionRules[collectionName][key][collectionRules[collectionName][key].length - 1]['createCollection'] ? 'bg-green-500' : 'bg-red-500'} rounded-md`}
                                onClick={() => handleButtonChange(collectionName, key, 'createCollection')}
                            >
                                C
                            </button>
                            <button
                                className={`w-8 h-8 mx-1 ${collectionRules[collectionName][key][collectionRules[collectionName][key].length - 1]['deleteCollection'] ? 'bg-green-500' : 'bg-red-500'} rounded-md mr-6`}
                                onClick={() => handleButtonChange(collectionName, key, 'deleteCollection')}
                            >
                                D
                            </button>

                            <button
                                className={`w-8 h-8 mx-1 ${collectionRules[collectionName][key][collectionRules[collectionName][key].length - 1]['createRecord'] ? 'bg-green-500' : 'bg-red-500'} rounded-md`}
                                onClick={() => handleButtonChange(collectionName, key, 'createRecord')}
                            >
                                C
                            </button>
                            
                            <button
                                className={`w-8 h-8 mx-1 ${collectionRules[collectionName][key][collectionRules[collectionName][key].length - 1]['readRecord'] ? 'bg-green-500' : 'bg-red-500'} rounded-md`}
                                onClick={() => handleButtonChange(collectionName, key, 'readRecord')}
                            >
                                R
                            </button>

                            <button
                                className={`w-8 h-8 mx-1 ${collectionRules[collectionName][key][collectionRules[collectionName][key].length - 1]['updateRecord'] ? 'bg-green-500' : 'bg-red-500'} rounded-md`}
                                onClick={() => handleButtonChange(collectionName, key, 'updateRecord')}
                            >
                                U
                            </button>
                            
                            <button
                                className={`w-8 h-8 mx-1 ${collectionRules[collectionName][key][collectionRules[collectionName][key].length - 1]['deleteRecord'] ? 'bg-green-500' : 'bg-red-500'} rounded-md`}
                                onClick={() => handleButtonChange(collectionName, key, 'deleteRecord')}
                            >
                                D
                            </button>

                        </div>
                    </td>
                </tr>
                ))}


            </tbody>
        </table>

    </div>)
}


function ReturnDefaultTable({ collectionName, defaultRuleObject, setDefaultRuleObject }) {
    console.log(defaultRuleObject, collectionName)
    const [selectedOption, setSelectedOption] = useState("Custom");

    const handleOptionChange = (event, collection) => {
        const value = event.target.value;

        setSelectedOption(value);

        if (value === "Deny") {
            setDefaultRuleObject(
            prevEntries => {
                const updatedRules = {...prevEntries}
                updatedRules[collection]={
                    createCollection: false,
                    deleteCollection: false,
                    createRecord: false,
                    readRecord: false,
                    updateRecord: false,
                    deleteRecord: false,
                }
                return updatedRules
            });
        } else if (value === "Allow") {
            setDefaultRuleObject(
            prevEntries => {
                const updatedRules = {...prevEntries}
                updatedRules[collection]={
                    createCollection: true,
                    deleteCollection: true,
                    createRecord: true,
                    readRecord: true,
                    updateRecord: true,
                    deleteRecord: true,
                }
                return updatedRules
            });
        }
    };


    const displayMap = { createCollection: 'C', deleteCollection: 'D', createRecord: 'C', readRecord: 'R', updateRecord: 'U', deleteRecord: 'D' }

    // Function to toggle button state
    const toggleState = (buttonName, collection) => {
        setDefaultRuleObject(prevState => {
            const updatedState = {
                ...prevState,
                [collection]: {
                    ...prevState[collection],
                    [buttonName]: !prevState[collection][buttonName]
                }
            };
    
            // Update the dropdown value based on the updated state
            const actions = Object.values(updatedState[collection]);
            const allRed = actions.every(state => state === false);
            const allGreen = actions.every(state => state === true);
    
            if (allRed) {
                setSelectedOption("Deny");
            } else if (allGreen) {
                setSelectedOption("Allow");
            } else {
                setSelectedOption("Custom")
            }
    
            return updatedState;
        });
    };
    


    return (<div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
            <thead className="text-md  uppercase text-gray-300  bg-zinc-800">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Collection Name
                    </th>

                    <th scope="col" className="px-6 py-3">
                        Rule
                    </th>

                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody className="text-md">
                <tr className="">
                    <th scope="row" className="px-14 py-10 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {collectionName}
                    </th>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex ">

                        <div className="flex-col mt-2 mr-[180px] w-[400px]">
                            <label htmlFor="opDropdown" className="block text-sm font-medium text-gray-100 mb-0.5">Default Rule</label>
                            <select className="input w-full " id="opDropdown" value={selectedOption} onChange={(e)=>handleOptionChange(e, collectionName)}>
                                <option value="Allow">Allow All</option>
                                <option value="Deny">Deny All</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>

                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                        <div className="flex mb-2 mt-2.5 text-gray-300">
                            <div className="pr-14 pl-0.5">Collections</div>
                            <div>Documents</div>
                        </div>
                        <div className="flex">
                            {Object.keys(defaultRuleObject[collectionName]).map((buttonName, index) => (
                                <button
                                    key={index}
                                    className={`w-8 h-8 mx-1 rounded-md ${defaultRuleObject[collectionName][buttonName] ? 'bg-green-500' : 'bg-red-500'} ${index === 1 ? 'mr-6' : ''}`}
                                    onClick={() => toggleState(buttonName, collectionName)}
                                >
                                    {displayMap[buttonName]}
                                </button>
                            ))}
                        </div>
                    </td>
                </tr>


            </tbody>
        </table>

    </div>)
}