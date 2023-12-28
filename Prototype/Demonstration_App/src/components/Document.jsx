import { useState } from "react";
import { useAtom } from "jotai";
import { useSWRConfig } from "swr";
import { selectionAtom } from "../lib/state/selection";
import JSONPretty from "react-json-pretty";
import { Trash2 } from "lucide-react";
// import "react-json-pretty/themes/monikai.css";

export default function Documents() {
	const [selection, setSelection] = useAtom(selectionAtom);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { mutate } = useSWRConfig();

	const deleteDoc = async () => {
		try {
			const res = await fetch(`http://0.0.0.0:3690/delete_doc`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					collection_name: selection.collection,
					doc_id: selection.document._id.$oid,
				}),
			});

			const data = await res.json();
			console.log(data);

			// remove the deleted collection from the list of collections
			mutate(`http://0.0.0.0:3690/get_all_docs/${selection.collection}}`);
			setSelection({ collection: "", document: "" });

			setShowDeleteModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<label
				className="hidden btn btn-primary"
				htmlFor="delete-collection-modal"
			>
				Open Modal
			</label>
			<input
				className="hidden modal-state"
				id="delete-collection-modal"
				type="checkbox"
				checked={showDeleteModal}
			/>
			{/* Modal */}
			<div className="modal modal-open overflow-y-scroll">
				<label
					className="modal-overlay"
					htmlFor="delete-collection-modal"
				></label>
				<div
					className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 "w-1/4  h-1/4"
					`}
				>
					<label
						htmlFor="delete-collection-modal"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={() => setShowDeleteModal(false)}
					>
						✕
					</label>
					<h2 className="text-xl">Delete collection</h2>

					<div className="basis-full flex flex-col gap-2">
						Are you sure you want to delete the document with ID{" "}
						{selection?.document?._id?.$oid} from the collection{" "}
						{selection.collection} ?
						<p className="text-sm text-red-500 ">
							This action cannot be undone.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							className="btn bg-red-500 hover:bg-red-600 btn-block"
							onClick={deleteDoc}
						>
							Delete
						</button>
						{/* )} */}

						<button
							className="btn btn-block"
							onClick={() => setShowDeleteModal(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
			<div className="basis-1/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen overflow-y-scroll">
				<p>Document</p>
				{selection.collection && (
					<div className="justify-self-end self-end w-full transition-all duration-150 cursor-pointer">
						<Trash2 color="#e01b24" onClick={() => setShowDeleteModal(true)} />
					</div>
				)}

				<div className="flex justify-between items-center w-full">
					<JSONPretty
						id="doc"
						data={selection.document}
						style={{
							width: "100%",
						}}
					></JSONPretty>
				</div>
			</div>
		</>
	);
}
