import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import useSwr, { useSWRConfig } from "swr";
import { fileSelectionAtom } from "../lib/state/fileSelectionAtom";
import { FileIcon, defaultStyles } from "react-file-icon";
import {
	Trash2,
	//   File as FileIcon,
} from "lucide-react";
import { fetcher } from "../lib/utils/fetcher";
import "/src/assets/custom.css";

export default function File() {
	const [selection, setSelection] = useAtom(fileSelectionAtom);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { mutate } = useSWRConfig();

	const deleteFile = async () => {
		try {
			const id = selection.meta_data._id;
			const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/files/${id}`,
				{
					method: "DELETE",
					headers: {
						'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
					}
				},

			);

			const data = await res.json();
			console.log(data);

			// remove the deleted file and updata
			mutate(`${import.meta.env.VITE_BACKEND_URL}/files/list`);
			setSelection({ meta_data: null, file: null });

			setShowDeleteModal(false);
			// So the collection still remains open when we delete a document
		} catch (error) {
			console.log(error);
		}
	};

	const { data, error, isLoading } = useSwr(
		`${import.meta.env.VITE_BACKEND_URL}/files/list`,
		fetcher
	);

	function generateIcon(fileUrl) {
		const extension = fileUrl.split('.').pop().toLowerCase();

		const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);

		if (isImage) {
			return <img src={fileUrl} alt="File" style={{ maxWidth: '500px', maxHeight: '500px' }} />;
		} else {

			return <FileIcon radius={4} extension={extension} {...defaultStyles[extension]} />;
		}
	}

	return (
		<>
			<label className="hidden btn btn-primary" htmlFor="delete-file-modal">
				Open Modal
			</label>
			<input
				className="hidden modal-state"
				id="delete-file-modal"
				type="checkbox"
				checked={showDeleteModal}
			/>

			{/* Delete Modal */}
			<div className="modal modal-open overflow-y-scroll">
				<label className="modal-overlay" htmlFor="delete-file-modal"></label>
				<div
					className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 w-2/5  
					`}
				>
					<label
						htmlFor="delete-file-modal"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={() => setShowDeleteModal(false)}
					>
						✕
					</label>
					<h2 className="text-xl">Delete File</h2>

					<div className="basis-full flex flex-col gap-2">
						Are you sure you want to delete the file with ID{" "}
						{selection?.meta_data?._id}
						<p className="text-sm text-red-500 ">
							This action cannot be undone.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							className="btn bg-red-500 hover:bg-red-600 btn-block"
							onClick={deleteFile}
						>
							Delete
						</button>

						<button
							className="btn btn-block"
							onClick={() => setShowDeleteModal(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>

			<div className="basis-3/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen h-full overflow-y-scroll">
				<div className="flex justify-between">
					<div className="flex justiy-between">
						<p className="grow w-full">File</p>
					</div>

					{selection.meta_data && (
						<div className="justify-self-end self-end transition-all duration-150 cursor-pointer">
							<Trash2
								color="#e01b24"
								onClick={() => setShowDeleteModal(true)}
							/>
						</div>
					)}
				</div>
				<div className="flex justify-center">
					<div className="mx-auto flex flex-col justify-center items-center h-full">
						{/* <FileIcon size={350} /> */}

						<div style={{ width: '280px', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{generateIcon(selection.meta_data.link)}
						</div>

						<div className="mx-auto flex flex-col justify-between text-white mt-[120px]">
							<div className="text-xl flex justify-between">
								{/* <span style={{ color: "#908E94" }}>Name: </span> */}
								<span style={{ fontWeight: "bold" }} className="mb-2">
									{selection.meta_data.name}
								</span>
							</div>
							<hr className="border-t border-gray-500 border-solid h-0.5 my-[1px]" />
							<div className="text-xl flex justify-between">
								<span style={{ color: "#908E94" }}>ID: </span>
								<span className="ml-2">{selection.meta_data._id}</span>
							</div>
							<hr className="border-t border-gray-500 border-solid h-0.5 my-[1px]" />
							<div className="text-xl flex justify-between">
								<span style={{ color: "#908E94" }}>File Type: </span>
								<span className="ml-2">{selection.meta_data.type}</span>
							</div>
							<hr className="border-t border-gray-500 border-solid h-0.5 my-[1px]" />
							<div className="text-xl flex justify-between">
								<span style={{ color: "#908E94" }}>Link: </span>
								<a
									href={selection.meta_data.link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 ml-2"
								>
									{selection.meta_data.link}
								</a>
							</div>
							<hr className="border-t border-gray-500 border-solid h-0.5 my-[1px]" />
							<div className="text-xl flex justify-between">
								<span style={{ color: "#908E94" }}>Storage Name: </span>
								<span className="ml-2">{selection.meta_data.stored_name}</span>
							</div>
							<hr className="border-t border-gray-500 border-solid h-0.5 my-[1px]" />
							<div className="text-xl flex justify-between">
								<span style={{ color: "#908E94" }}>Size: </span>
								<span className="ml-2">{selection.meta_data.size} bytes</span>
							</div>
							<hr className="border-t border-gray-500 border-solid h-0.5 my-[1px]" />
							<div className="text-xl flex justify-between">
								<span style={{ color: "#908E94" }}>Created At: </span>
								<span className="ml-2">
									{Date(selection.meta_data.createdAt)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
