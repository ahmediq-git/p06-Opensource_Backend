import React, { useState, useEffect } from 'react';
import SideRail from '../components/SideRail';

export default function FunctionsPage() {
    const [collections, setCollections] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [intervalValue, setIntervalValue] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        // Fetch collections from backend
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collections`);
            const data = await response.json();
            console.log("DATA", data.data);
            setCollections(data.data);
            console.log("COLLECTIONS", collections);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const handleRegister = async () => {
        try {
            let data;
            // Prepare data object
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
            else if(selectedFunction == "Backup") {
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Handle response
            if (response.ok) {
                alert("Your function was registered!")
                console.log('Registration successful');
            } else {
                alert("There was an error registering your function!")
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="flex bg-gray-900 text-gray-50 h-screen max-h-screen">
            <SideRail />
            <div className="bg-gray-800 p-8 rounded-lg">
                <label htmlFor="dropdown1" className="block mb-2">Run</label>
                <select id="dropdown1" className="mb-4 text-black" onChange={(e) => setSelectedFunction(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Export">Export</option>
                    <option value="Backup">Backup</option> {/* Added Backup option */}
                    {/* Add other options if needed */}
                </select>

                {(selectedFunction === 'Export' || selectedFunction === 'Backup') && (
                    <>
                        <label htmlFor="dropdown2" className="block mb-2">{selectedFunction === 'Export' ? 'Export collection' : 'Backup collections'}</label>
                        <select
                            id="dropdown2"
                            value={selectedCollections}
                            onChange={(e) => setSelectedCollections(Array.from(e.target.selectedOptions, (item) => item.value))}
                            multiple={selectedFunction === 'Backup'}
                            className="mb-4 text-black" // Added text-black class here
                        >
                            {collections.map((collection, index) => (
                                <option key={index} value={collection}>{collection}</option>
                            ))}
                        </select>

                        <label htmlFor="input1" className="block mb-2">After every</label>
                        <input
                            type="number"
                            id="input1"
                            value={intervalValue}
                            onChange={(e) => setIntervalValue(e.target.value)}
                            className="mb-4 px-2 py-1 border rounded-lg text-black"
                        />

                        {selectedFunction === 'Export' && (
                            <>
                                <label htmlFor="input2" className="block mb-2">to file</label>
                                <input
                                    type="text"
                                    id="input2"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="mb-4 px-2 py-1 border rounded-lg text-black"
                                />
                            </>
                        )}
                    </>
                )}

                <button onClick={handleRegister} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Register Function</button>
            </div>
        </div>
    );
};
