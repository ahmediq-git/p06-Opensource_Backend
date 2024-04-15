import React, { useState, useEffect, useRef } from 'react';
import SideRail from '../components/SideRail';
import { Trash2 } from 'lucide-react';
import Alert from '../components/Alert';
import _isEqual from 'lodash/isEqual';

export default function FunctionsPage() {
    const [collections, setCollections] = useState([]);
    const [registeredFunctions, setRegistered] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [intervalValue, setIntervalValue] = useState('');
    const [fileName, setFileName] = useState('');


    const MAX_SIZE = 30;

    const [messages, setMessages] = useState([]);

    // Use a ref to keep track of the maximum size
    const messagesRef = useRef(0);

    // Function to update messages with limited size and keep chronology
    const updateMessages = (newMessages) => {
        // Update messages state with new messages
        if (!Array.isArray(newMessages)) {
            newMessages = []; // Set it to an empty array if it's not an array
        }
        
        if (!_isEqual(messages, newMessages)){
            setMessages(prevMessages => {
            // Create a set to store unique messages
            const uniqueMessages = new Set([...prevMessages, ...newMessages]);

            // Convert set back to array, reverse it to maintain chronology, and slice it to the maximum size
            const limitedMessages = Array.from(uniqueMessages).reverse().slice(0, MAX_SIZE);

            return limitedMessages.reverse();
        });


        messagesRef.current = messages.length;
        }
    };

    

    useEffect(() => {
        const fetchData = async () => {
            await fetchCollections();
            await fetchRegisteredFunctions();
        };
    
        // Fetch data at mount
        fetchData();
    
        // Set up interval to fetch data every 3 seconds
        const interval = setInterval(fetchData, 10000);
    
        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collections`, {
                headers: {
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                }
            });
            const data = await response.json();

            setCollections(data.data.filter(item => item !== 'users'));
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };


    const fetchRegisteredFunctions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/functions/registered_functions`, {
                headers: {
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                }
            });
            const data = await response.json();
            
            setRegistered(data.data);
            updateMessages(data.data);
            
            
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const handleRegister = async () => {
        try {
            let data;
            if (selectedFunction == "Export") {
                data = {
                    new_function: {
                        lastRun: null,
                        runAfter: intervalValue,
                        op: "export",
                        toExport: selectedCollections,
                        outName: fileName
                    }
                };
            }
            else if (selectedFunction == "Backup") {
                data = {
                    new_function: {
                        lastRun: null,
                        runAfter: intervalValue,
                        op: "backup",
                        toBackup: selectedCollections
                    }
                };
            }

            // Call the register function endpoint
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/functions/register_function`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')

                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                await fetchRegisteredFunctions();
                alert("Function registered!");
            } else {
                alert("There was an error registering your function!")
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
        setSelectedCollections([])
    };

    const handleDeleteFunction = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/functions/delete_function`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                },
                body: JSON.stringify({ id })
            });
            if (response.error == null) {
                await fetchRegisteredFunctions();
                alert("Function deleted!")
            } else {
                alert("There was an error deleting a function!")
                console.error('Deletion failed');
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
        setSelectedCollections([])
    }

    return (
        <div className="flex bg-black-900 text-gray-50 h-screen max-h-screen">
            <SideRail />
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>

            <div className=" p-8 rounded-lg text-l">
                <label htmlFor="dropdown1" className="block mb-2">Run</label>
                <select id="dropdown1" className="mb-4 select" onChange={(e) => setSelectedFunction(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Export">Export</option>
                    <option value="Backup">Backup</option>
                    {/* future options go here */}
                </select>

                {(selectedFunction === 'Export' || selectedFunction === 'Backup') && (
                    <>
                        <label htmlFor="dropdown2" className="block mb-2 label">{selectedFunction === 'Export' ? 'Export collection' : 'Backup collections'}</label>
                        <select
                            id="dropdown2"
                            value={selectedCollections}
                            onChange={(e) => setSelectedCollections(Array.from(e.target.selectedOptions, (item) => item.value))}
                            multiple={selectedFunction === 'Backup'}
                            className="mb-4 select"
                        >
                            {collections.map((collection, index) => (
                                <option key={index} value={collection}>{collection}</option>
                            ))}
                        </select>

                        <label htmlFor="input1" className="block mb-2">After every (seconds)</label>
                        <input
                            type="number"
                            id="input1"
                            value={intervalValue}
                            onChange={(e) => setIntervalValue(e.target.value)}
                            className="mb-4 px-2 py-1 border input"
                        />

                        {selectedFunction === 'Export' && (
                            <>
                                <label htmlFor="input2" className="block mb-2">to file</label>
                                <input
                                    type="text"
                                    id="input2"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="mb-4 px-2 py-1 border input"
                                />
                            </>
                        )}
                    </>
                )}

            <button onClick={handleRegister} className="btn btn-outline-primary hover:btn-secondary w-full menu-item duration-75 transition-all mt-2">Register Function</button>
            </div>
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>
            {/* Registered functions list */}
            <div className="ml-8 p-4 rounded-lg">
                <h2 className="text-xl mb-4 text-white">Registered Functions</h2>
                {registeredFunctions.length > 0 ? (
                    <ul className="text-white">
                        {registeredFunctions.map((func) => (
                            <li key={func.id} className="flex items-center justify-between mt-4 border-b border-gray-600 py-2 hover:bg-gray-700 hover:scale-105">
                                <span>{func.data}</span>
                                <Trash2 className="ml-4" color="red" cursor="pointer" onClick={() => handleDeleteFunction(func.id)} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No functions registered</p>
                )}
            </div>
            <div className="w-[2px] h-screen bg-gray-100 opacity-10 ml-3"></div>

            <TerminalUi messages={messages}/>
        </div>
    );
}


function TerminalUi({messages}){
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <h2 className="text-md m-2 text-white">Function Runtime Logs</h2>
        <div className="flex-grow min-w-[300px] justify-center items-center overflow-y-auto border border-white rounded-lg mb-4 bg-gray-950 mx-7 mt-0 p-5">
          {messages.map((message, index) => (
            <p key={index} className="text-white">
              {'>'} {message['function_log']}
            </p>
          ))}
        </div>
      </div>
    );
  }