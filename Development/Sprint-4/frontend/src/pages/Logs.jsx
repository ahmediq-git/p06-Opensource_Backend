import { useEffect, useState } from 'react';
import SideRail from '../components/SideRail';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../lib/utils/fetcher';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Logs() {
    const { mutate } = useSWRConfig();
    const { data: initialData, error, isLoading } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/record/list?collection_name=logs&queryOptions=` + encodeURIComponent(JSON.stringify({ sort: { createdAt: -1 } })),
        fetcher
    );
    const [data, setData] = useState(initialData);
    const [chartType, setChartType] = useState('timeTaken');

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

    const totalPages =
        data && data.data ? Math.ceil(data.data.length / pageSize) : 1;

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
        const last12Logs = data.data.slice(0, 24);
        last12Logs.reverse();
        const timeTakenData = {
            labels: [],
            datasets: [
                {
                    label: "Time Taken",
                    data: [],
                    fill: true,
                    borderColor: [], // Dynamically set borderColor
                    tension: 0.2,
                },
            ],
        };
    
        last12Logs.forEach((log) => {
            timeTakenData.labels.push(formatTime(log.createdAt));
            timeTakenData.datasets[0].data.push(log.time_taken);
            timeTakenData.datasets[0].borderColor.push(log.time_taken > 200 ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)');
        });
    
        return timeTakenData;
    };

    const getDataSentReceived = () => {
        const last12Logs = data.data.slice(0, 24);
        last12Logs.reverse();
        const dataSentReceived = {
            labels: last12Logs.map(log => formatTime(log.createdAt)),
            datasets: [
                {
                    label: 'Data Sent',
                    backgroundColor: '#155e75',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: last12Logs.map(log => log.request_size)
                },
                {
                    label: 'Data Received',
                    backgroundColor: '#78350f',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: last12Logs.map(log => log.response_size)
                }
            ]
        };

        return dataSentReceived;
    };

    const getUniqueUrlsHistogramData = () => {
        const uniqueUrls = {};
        data.data.forEach(log => {
            const urlPath = new URL(log.url).pathname;

            if (!uniqueUrls[urlPath]) {
                uniqueUrls[urlPath] = 1;
            } else {
                uniqueUrls[urlPath]++;
            }
        });
        const urlCounts = Object.entries(uniqueUrls);
        urlCounts.sort((a, b) => b[1] - a[1]);
        const labels = urlCounts.map(([url, count]) => url);
        const dataCounts = urlCounts.map(([url, count]) => count);
        return {
            labels: labels,
            datasets: [{
                label: 'Endpoint hits',
                backgroundColor: '#047857',
                borderColor: '#ecfeff',
                borderWidth: 1.2,
                data: dataCounts,
            }]
        };
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
        <div className="flex bg-black-900 text-gray-50 h-screen max-h-screen">
            <SideRail />
            <div className="flex flex-col w-full overflow-y-scroll">
                <p className="text-3xl font-bold mb-4 p-6 text-center">LOGS</p>
                <div className="mx-auto h-4/6 mb-4 px-4 w-full">
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => setChartType('timeTaken')}
                            className={`px-4 py-2 mr-2 rounded ${chartType === 'timeTaken' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            Time Taken
                        </button>
                        <button
                            onClick={() => setChartType('dataSentReceived')}
                            className={`px-4 py-2 rounded ${chartType === 'dataSentReceived' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            Data Sent/Received
                        </button>
                        <button
                            onClick={() => setChartType('histogram')}
                            className={`ml-2 px-4 py-2 rounded ${chartType === 'histogram' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            Hit Frequency
                        </button>
                    </div>
                    {data && data.data && data.data.length !== 0 ? (
                        chartType === 'timeTaken' ? (
                            <Line data={getTimeTakenData()} options={{
                                maintainAspectRatio: true,
                                aspectRatio: 3
                            }}/>
                        ) : chartType === 'dataSentReceived' ? (
                            <Bar data={getDataSentReceived()} options={{
                                maintainAspectRatio: true,
                                aspectRatio: 3
                            }}/>
                        ) :(
                            <div className="h-full w-full">
                                {/* Chart for histogram */}
                                <div className="mx-auto">
                                    {data && data.data && data.data.length !== 0 ? (
                                        <Bar data={getUniqueUrlsHistogramData()} options={{
                                            maintainAspectRatio: true,
                                            aspectRatio: 3.5
                                        }}/>
                                    ) : (
                                        <p className="text-center text-gray-300">No logs found</p>
                                    )}
                                </div>
                            </div>
                        )
                    ): (
                        <p className="text-center text-gray-300">No logs found</p>
                    )}
                </div>
                {data && data.data && data.data.length !== 0 ? (
                    <>
                        <div className="px-4 mt-4">
                            {chartType === 'dataSentReceived' && (
                                <div className="flex justify-center mb-4">
                                    {(() => {
                                        let req_sum = 0;
                                        let res_sum = 0;
                                        data.data.forEach((log) => {
                                            req_sum += log.request_size;
                                            res_sum += log.response_size;
                                        });
                                        const formatBytes = (bytes) => {
                                            if (bytes === 0) return '0 Bytes';
                                            const k = 1024;
                                            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                                            const i = Math.floor(Math.log(bytes) / Math.log(k));
                                            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                                        };
                                        return (
                                            <>
                                                <div className="mr-12 text-center">
                                                    <p className="font-bold">Data sent</p>
                                                    <p>{formatBytes(req_sum)}</p>
                                                </div>
                                                <div className="ml-12 text-center">
                                                    <p className="font-bold">Data received</p>
                                                    <p>{formatBytes(res_sum)}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}

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
                    </>

                ) : null}

            </div>
        </div>
    );
}
