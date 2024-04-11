import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

export default function Logs() {
	const { mutate } = useSWRConfig();
	const { data: initialData, error, isLoading } = useSWR(
		"http://127.0.0.1:3690/api/record/list?collection_name=logs",
		fetcher
	);
	const [data, setData] = useState(initialData);

	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	useEffect(() => {
	}, [data, error, isLoading]);

	const formatDateTime = (dateTimeString) => {
		return new Date(dateTimeString).toLocaleString();
	};

	return (
		<>
			<div className="bg-black-100 p-4 rounded-lg overflow-y-auto max-h-96">
				<p className="text-lg font-bold mb-2">LOGS</p>
				<table className="table-auto w-full">
					<thead>
						<tr>
							<th className="px-4 py-2">METHOD</th>
							<th className="px-4 py-2">URL</th>
							<th className="px-4 py-2">DATE</th>
						</tr>
					</thead>
					<tbody>
						{data?.length !== 0 ? (
							data?.data.slice(0, 25).map((log) => (
								<tr key={log._id} className="border-b border-gray-300">
									<td className="px-4 py-2">{log.method}</td>
									<td className="px-4 py-2">{log.url}</td>
									<td className="px-4 py-2">{formatDateTime(log.createdAt)}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="3" className="px-4 py-2 text-gray-500 text-center">No documents</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
