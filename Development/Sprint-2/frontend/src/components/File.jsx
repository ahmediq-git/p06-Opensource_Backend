import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import useSwr, { useSWRConfig } from "swr";
import { fileSelectionAtom } from "../lib/state/fileSelectionAtom";
import JSONPretty from "react-json-pretty";
import { Trash2, MinusCircle, Pencil, PlusCircle, File as FileIcon } from "lucide-react";
import { fetcher } from "../lib/utils/fetcher";
import "/src/assets/custom.css";

export default function File() {
	const [selection, setSelection] = useAtom(fileSelectionAtom);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { mutate } = useSWRConfig();
	
	const deleteFile = async () => {
		try {
            const id = selection.meta_data._id
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/files/${id}`, {
				method: "DELETE",
			});

			const data = await res.json();
            console.log(data)

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


	return (
		<>
			<label
				className="hidden btn btn-primary"
				htmlFor="delete-file-modal"
			>
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
				<label
					className="modal-overlay"
					htmlFor="delete-file-modal"
				></label>
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
    <FileIcon size={400} />
    <div className="mx-auto flex flex-col justify-between text-white mt-4 ml-32">
        <div className="text-xl">Name: {selection.meta_data.name}</div>
        <div className="text-xl">ID: {selection.meta_data._id}</div>
        <div className="text-xl">File Type: {selection.meta_data.type}</div>
        <div className="text-xl">
            Link: <a href={selection.meta_data.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{selection.meta_data.link}</a>
        </div>
        <div className="text-xl">Storage Name: {selection.meta_data.stored_name}</div>
        <div className="text-xl">Size: {selection.meta_data.size} bytes</div>
        <div className="text-xl">Created At: {selection.meta_data.createdAt} bytes</div>
    </div>
</div>

                </div>
			</div>
		</>
	);
}
