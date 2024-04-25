import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAtom } from "jotai";
import { fileSelectionAtom } from "../lib/state/fileSelectionAtom";
import useSwr, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";
import { record, z } from "zod";
import axios from "axios";
import { BlockBlobClient } from '@azure/storage-blob';

// Naming Schema for Files
const fileNamingSchema = z.string().refine(
	(val) => /^[a-zA-Z\-_]+$/.test(val.trim()),
	{
		message: "File name should not contain numbers, spaces, or special characters.",
	}
);

export default function Files() {

	const {
		data: initialData,
		error: fetchError,
	} = useSwr(
		`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/blobStorage`,
		fetcher
	);

	const [selection, setSelection] = useAtom(fileSelectionAtom);
	const { mutate } = useSWRConfig();

	// for the actual file itself and not the overall global file selection
	const [file, setFile] = useState(null);
	const [sasTokenUrl, setSasTokenUrl] = useState('');
	const [blobStorageSettings, setBlobStorageSettings] = useState({
		useBlobStorage: false,
		serviceName: "",
		serviceKey: "",
		storageConnectionString: "",
		containerName: "",
		region: "",
		sas: "",
	});

	useEffect(() => {
		if (initialData && initialData.data) {
			setBlobStorageSettings(initialData.data);
		}
	}, [initialData]);


	const { data, error, isLoading } = useSwr(
		`${import.meta.env.VITE_BACKEND_URL}/files/list`,
		fetcher
	);

	const handleFileChange = async (event) => {
		try {
			const file = event.target.files[0];
			setFile(file);
			await uploadFile(file)
		} catch (error) {
			console.log(error)
		}
	};

	const setFileSelection = (metadata) => {
		setSelection({ meta_data: metadata, file: null });
	};

	const uploadFile = async (file) => {
		try {

			if (blobStorageSettings.useBlobStorage) {

				const permission = 'w';
				const timerange = 5;

				const res = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/files/sas?file=${encodeURIComponent(
						file.name
					)}&permission=${permission}&container=${blobStorageSettings.containerName}&timerange=${timerange}`,
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
						}
					}
				)
					.then(async function (response) {
						console.log("Response:", response);
						if (response.data.error) {
							console.log("Error:", response.data.error)
							return;
						}
						setSasTokenUrl(response.data.data.sas);
						const fileBuffer = await file.arrayBuffer();
						const blockBlobClient = new BlockBlobClient(sasTokenUrl);
						const res = await blockBlobClient.uploadData(fileBuffer);
						if (res.errorCode) {
							console.log('Error:', res.errorCode);
							return;
						}
						const formData = new FormData();
						const fileObject = { name: file.name, url: blockBlobClient.url, size: file.size };
						const isBlobFile = true;
						formData.append('file', JSON.stringify(fileObject));
						formData.append('isBlobFile', isBlobFile.toString());
						const apiEndpoint = `/api/files`;
						const resp = await this.client.sendToBackend(formData, apiEndpoint, "POST", true);
					})
					.catch(error => {
						console.log("Error:", error)
					})


			}
			else {
				const formData = new FormData();
				formData.append('file', file);
				const res = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/files`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
							'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
						},
					}
				);
			}
			// const adsa = await res.json();

			mutate(`${import.meta.env.VITE_BACKEND_URL}/files/list`);

		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="basis-1/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen overflow-y-scroll">
			<input
				type="file"
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>

			<button
				onClick={() => {
					const fileInput = document.querySelector('input[type="file"]');
					if (fileInput) {
						fileInput.click();
					}
				}}
				className="btn btn-outline-primary hover:btn-secondary menu-item duration-75 transition-all w-full"
			>
				Upload File
			</button>


			<nav className="menu  p-2 rounded-md">
				<section className="menu-section">
					<ul className="menu-items gap-2">
						{data?.length !== 0 ? (
							data?.data?.map((cur_file) => (
								<li
									key={cur_file._id}
									className={`menu-item ${selection?.meta_data?._id === cur_file._id
										? "menu-active"
										: null
										} bg-gray-2 flex justify-between`}
									onClick={() => setFileSelection(cur_file)}
								>
									<p>{cur_file.name}</p>
									<ArrowRight />
								</li>
							))
						) : (
							<li className="p-2 rounded-lg ">
								<p>No Files in the system</p>
							</li>
						)}
					</ul>
				</section>
			</nav>


		</div>
	);
}