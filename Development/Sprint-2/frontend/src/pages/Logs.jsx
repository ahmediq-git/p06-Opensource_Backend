import React, { useEffect, useState } from 'react';
import SideRail from '../components/SideRail';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../lib/utils/fetcher';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Logs() {
    const { mutate } = useSWRConfig();
    const { data: initialData, error, isLoading } = useSWR(
        'http://localhost:3690/api/record/list?collection_name=logs&queryOptions=' + encodeURIComponent(JSON.stringify({ sort: { createdAt: -1 } })),
        fetcher
    );
    const [data, setData] = useState(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString();
    };

    const formatTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleTimeString();
    };

    const pageSize = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = data && data.data ? Math.ceil(data.data.length / pageSize) : 1;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getTimeTakenData = () => {
        const last12Logs = data.data.slice(0, 12);
        last12Logs.reverse()
        const timeTakenData = {
            labels: [],
            datasets: [{
                label: 'Time Taken',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        last12Logs.forEach(log => {
            timeTakenData.labels.push(formatTime(log.createdAt)); 
            timeTakenData.datasets[0].data.push(log.time_taken);
        });

        return timeTakenData;
    };

    const getColorForMethod = (method) => {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'text-blue-500';
            case 'POST':
                return 'text-green-500';
            case 'PATCH':
                return 'text-yellow-500';
            case 'DELETE':
                return 'text-red-500';
            case 'OPTIONS':
                return 'text-purple-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="flex bg-gray-900 text-gray-50 h-screen max-h-screen">
            <SideRail />
            <div className="flex flex-col w-full overflow-y-scroll">
                <p className="text-3xl font-bold mb-4 p-6 text-center">LOGS</p>
                <div className="mx-auto w-full mb-4 px-4">
                    {data && data.data && data.data.length !== 0 ? (
                        <Line data={getTimeTakenData()} />
                    ) : (
                        <p className="text-center text-gray-300">No logs found</p>
                    )}
                </div>
                {data && data.data && data.data.length !== 0 ? (
                    <div className="px-4">
                        <table className="table-auto w-full rounded-lg shadow-lg bg-gray-800 overflow-hidden mb-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-center bg-black">METHOD</th>
                                    <th className="px-4 py-2 text-center bg-black">URL</th>
                                    <th className="px-4 py-2 text-center bg-black">DATE</th>
                                    <th className="px-4 py-2 text-center bg-black">TIME TAKEN (ms)</th>
                                    <th className="px-4 py-2 text-center bg-black">STATUS</th>
                                    <th className="px-4 py-2 text-center bg-black">ORIGIN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((log) => (
                                    <tr key={log._id} className="border-b border-gray-300 hover:bg-gray-900">
                                        <td className={`px-4 py-2 text-center font-bold ${getColorForMethod(log.method)}`}>{log.method}</td>
                                        <td className="px-4 py-2 text-center overflow-hidden">
                                            <div className="w-80 overflow-hidden whitespace-nowrap text-ellipsis text-center ml-auto mr-auto" title={log.url}>{log.url}</div>
                                        </td>
                                        <td className="px-4 py-2 text-center">{formatDateTime(log.createdAt)}</td>
                                        <td className="px-4 py-2 text-center">{log.time_taken}</td>
                                        <td className={`px-4 py-2 text-center font-bold ${log.status === 200 ? 'text-green-500' : 'text-red-500'}`}>{log.status}</td>
                                        <td className="px-4 py-2 text-center">{log.origin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 mr-2 rounded ${currentPage === 1 ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    >
                        {'<'}
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        className={`px-4 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </div>
    );
}
