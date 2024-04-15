import React, { useState } from 'react';
import SideRail from '../components/SideRail';
import {ServerOff, Server as ServerIcon } from 'lucide-react';


export default function StressTestPage() {
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [totalRequests, setTotalRequests] = useState(0);
    const [averageResponseTime, setAverageResponseTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [successRate, setSuccessRate] = useState(0);
    const [totalDataSent, setTotalDataSent] = useState(0);

    const createCollection = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collections/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                },
                body: JSON.stringify({ collection_name: "stress" }),
            });
        } catch (error) {
            console.error('Error creating stress test collection:', error);
        }
    };

    const deleteCollection = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collections/stress`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                },
            });
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    const handleStartTest = async () => {
        setIsLoading(true);
        setErrorCount(0);
        setSuccessRate(0);
        setTotalRequests(0);
        setAverageResponseTime(0);
        setTotalDataSent(0);
        setDone(false);

        await createCollection();

        const startTime = Date.now();
        let totalRequestsSent = 0;
        let totalErrors = 0;
        let totalBytesSent = 0;

        const sendRequest = async () => {
            const requestBody = generateRandomRequestBody();
            const jsonBody = JSON.stringify({ obj: requestBody });
            totalBytesSent += new Blob([jsonBody]).size; // Calculate size of data sent
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stress/stress_test`, {
                    method: 'POST',
                    body: jsonBody,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                    },
                });
                totalRequestsSent++;
                setTotalRequests(totalRequestsSent);
                if (!response.ok) {
                    totalErrors++;
                    setErrorCount(totalErrors);
                }
            } catch (error) {
                console.error('Error sending request:', error);
                totalErrors++;
                setErrorCount(totalErrors);
            }
        };

        const endTime = Date.now() + duration * 1000;
        while (Date.now() < endTime) {
            setProgress(((duration * 1000 - (endTime - Date.now())) / (duration * 1000)) * 100)
            await sendRequest();
        }

        const successfulRequests = totalRequestsSent - totalErrors;
        setSuccessRate((successfulRequests / totalRequestsSent) * 100 || 0);
        setAverageResponseTime(totalRequestsSent / duration);
        setTotalDataSent(totalBytesSent);

        await deleteCollection();
        setDone(true);
        setIsLoading(false);
    };

    const generateRandomRequestBody = () => {
        const numFields = Math.floor(Math.random() * 10) + 1; // Random number of fields (1 to 10)
        const requestBody = {};
        for (let i = 0; i < numFields; i++) {
            requestBody[`field${i}`] = Math.random().toString(36).substring(2); // Random field value
        }
        return requestBody;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex bg-black-900 text-gray-50 h-screen max-h-screen text-center">
            <SideRail />
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>

            <div className="flex flex-col justify-center items-center w-full gap-y-12s">
                <h1 className="text-2xl font-bold mb-8"> API Stress Test </h1>
                <div className="flex items-center mb-4 mr-12">
                    <label htmlFor="duration" className="mr-4 text-l mt-4">
                        Test Duration (seconds):
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-md input text-l mr-[65px]"
                    />
                </div>
                <button
                    onClick={handleStartTest}
                    disabled={isLoading || duration <= 0}
                    className="bg-blue-500 hover:bg-blue-600 rounded mb-4 text-white px-4 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-l shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {isLoading ? 'Running Test...' : 'Start Test'}
                </button>
                {!isLoading && done && (
                    <>
                        {averageResponseTime === 0?
                        <div className="flex flex-col">
                            <ServerOff size={200} className="ml-8"/>
                            <h2 className="text-2xl mt-4">Your Server is switched off</h2>
                        </div>
                        : 
                        (<div>
                            <ServerIcon size={200}/>
                            <h2 className="text-2xl mt-4">Test Completed! 🎉</h2>
                        </div>)
                        }
                        
                    </>
                )}

                {averageResponseTime !==0?
                (<div className="flex flex-col">
                    {totalRequests > 0 && (
                        <div className="mt-4 text-l">
                            <p>Total Requests Sent: {totalRequests}</p>
                        </div>
                    )}
                    {!isLoading && done && (
                        <div className="mt-4 text-l">
                            <p>Average Response Time: {averageResponseTime.toFixed(2)} ms</p>
                        </div>
                    )}
                    {!isLoading && done && (
                        <div className="mt-4 text-xl">
                            <p className="font-semibold text-red-700">Error Count: {errorCount}</p>
                            <p className="font-semibold text-green-700">Success Rate: {successRate.toFixed(2)}%</p>
                            <p>Total Data Sent: {formatBytes(totalDataSent)}</p>
                        </div>
                    )}
                </div>) :(<div></div>)
                }
                {!done && (
                    <progress className="progress progress-secondary w-80 mt-8" value={progress} max="100"></progress>
                )}
            </div>
        </div>
    );
};

