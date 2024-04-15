import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAtom } from "jotai";
import { fileSelectionAtom } from "../lib/state/fileSelectionAtom";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";
import { record, set, z } from "zod";
import axios from "axios";
import Popup from "reactjs-popup";

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
	} = useSWR(
		`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/blobStorage`,
		fetcher
	);

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

	const [selection, setSelection] = useAtom(fileSelectionAtom);
	const { mutate } = useSWRConfig();
	const [sasTokenUrl, setSasTokenUrl] = useState('');
	// for the actual file itself and not the overall global file selection
	const [file, setFile] = useState(null);
	const [encrypt, setEncrypt] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { data, error, isLoading } = useSWR(
		`${import.meta.env.VITE_BACKEND_URL}/files/list`,
		fetcher
	);


	const handleFileChange = async (event) => {
		try {
			console.log("File Change Event:", event);
			const file = event.target.files[0];
			setFile(file);
			setEncrypt(false);
			console.log("File Selected:", file);
			// 	await uploadFile(file)
		} catch (error) {
			console.log(error)
		}
	};

	const setFileSelection = (metadata) => {
		setSelection({ meta_data: metadata, file: null });
	};

	const uploadFile = async (file) => {
		try {
			console.log("Upload File Function");
			if (password !== confirmPassword) {
				alert("Passwords do not match!");
				return;
			}
			if (password.length === 0) {
				alert("Password cannot be empty!");
				return;
			}
			const formData = new FormData();
			formData.append('file', file);
			formData.append('password', password);  // Append password for encryption
			// console.log("Blob Storage Settings:", blobStorageSettings);
			// console.log("Form Data:", formData)
			// console.log("File:", file)
			// console.log("File Name:", file.name)
			// console.log(formData.get('file'))
			if (blobStorageSettings.useBlobStorage) {
				const permission = 'w';
				const timerange = 5;

				if (!selection) return;

				const res = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/files/sas?file=${encodeURIComponent(
						file.name
					)}&permission=${permission}&container=${blobStorageSettings.containerName}&timerange=${timerange}`,
					{
						headers: {
							'Content-Type': 'application/json',
							// 'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					}
				)
					// response will be received in the form:
					// c.json({
					// 	error: false,
					// 	data: sasUrl
					// });
					.then(response => {
						console.log("Response:", response);
						if (response.data.error) {
							console.log("Error:", response.data.error)
							return;
						}
						setSasTokenUrl(response.data.data)
					})
					.catch(error => {
						console.log("Error:", error)
					})
			}

			else {
				const res = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/files`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data'
						},
					}
				);
				console.log("Response:", res);
				// const adsa = await res.json();

				// console.log("ADSA", adsa);
			}

			console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOO");
			mutate(`${import.meta.env.VITE_BACKEND_URL}/files/list`);
			setFile(null);
			setPassword('');
			setConfirmPassword('');
			setEncrypt(false);

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

			{file && (
				<Popup open={file !== null} closeOnDocumentClick={false}>
					{close => (
						<form onSubmit={(e) => {
							e.preventDefault();
							uploadFile(file);
							close();
						}}>
							{/* checkbox for encryption */}
							<label>File: {file.name}</label>
							{/* Ask user if they want to encrypt the file through a checkbox */}
							<label>Set Encryption: <input type="checkbox" value={encrypt} onChange={e => setEncrypt(e.target.checked)} /></label>
							<label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
							<label>Confirm Password: <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></label>
							<button type="submit">Encrypt and Upload</button>
							<button onClick={() => {
								setEncrypt(false);
								close();
							}}>Cancel</button>
						</form>
					)}
				</Popup>
			)}

			<nav className="menu  p-2 rounded-md">
				<section className="menu-section">
					<ul className="menu-items gap-2">
						{data?.length !== 0 ? (
							data?.data.map((cur_file) => (
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

			<Popup >

			</Popup>


		</div>
	);
}