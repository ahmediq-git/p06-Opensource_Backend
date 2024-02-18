import React from 'react';
import SideRail from '../components/SideRail';
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

export default function Logs() {
    const { mutate } = useSWRConfig();
	const { data: initialData, error, isLoading } = useSWR(
		"http://localhost:3690/api/record/list?collection_name=logs",
		fetcher
	);
	const [data, setData] = useState(initialData);

	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	useEffect(() => {
		console.log("data", data);
		console.log("error", error);
		console.log("isLoading", isLoading);
	}, [data, error, isLoading]);

	const formatDateTime = (dateTimeString) => {
		return new Date(dateTimeString).toLocaleString();
	};
  return (
    <div className="flex bg-neutral-950 text-gray-50 h-screen max-h-screen overflow-y-scroll">
        	<SideRail />
            <div className="flex flex-col w-full"> 
			
				<p className="text-lg font-bold mb-2 p-4">LOGS</p>
                {data && data?.length !== 0 ? (
				<table className="table-auto w-full mt-9">
					<thead>
						<tr>
							<th className="px-4 py-2">METHOD</th>
							<th className="px-4 py-2">URL</th>
							<th className="px-4 py-2">DATE</th>
						</tr>
					</thead>
					<tbody>
					
							{data?.data.slice(0, 25).map((log) => (
								<tr key={log._id} className="border-b border-gray-300">
									<td className="px-4 py-2">{log.method}</td>
									<td className="px-4 py-2">{log.url}</td>
									<td className="px-4 py-2">{formatDateTime(log.createdAt)}</td>
								</tr>
							))
                            }
				
					</tbody>
				</table>
                ) : (
                <div className="flex-grow flex justify-center items-center"> 
                    <p className="text-2xl font-bold text-center">No logs found</p>
                </div>

                )}
		
		</div>
    </div>
  )
}
