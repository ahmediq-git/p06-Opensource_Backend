import { useState } from "react";
import Collections from "./components/Collections";
import SideRail from "./components/SideRail";
import Documents from "./components/Documents";
import Document from "./components/Document";
import { Trash2 } from "lucide-react";
import { selectionAtom } from "./lib/state/selection";
import { useAtom } from "jotai";
import { useSWRConfig } from "swr";

function App() {
	const [selection, setSelection] = useAtom(selectionAtom);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { mutate } = useSWRConfig();

	const deleteCollection = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:3690/delete_collection`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					collection_name: selection.collection,
					delete_all_data: true,
				}),
			});

			const data = await res.json();

      // remove the deleted collection from the list of collections
      setSelection({ collection: "", document: "" })
			mutate('http://127.0.0.1:3690/get_collection_names')
      setShowDeleteModal(false);
      
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex bg-neutral-900 text-gray-50 h-screen max-h-screen overflow-y-scroll">
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
						Are you sure you want to delete the collection{" "}
						{selection.collection} ?
						<p className="text-sm text-red-500 ">
							This action cannot be undone.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							className="btn bg-red-500 hover:bg-red-600 btn-block"
							onClick={deleteCollection}
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
			<SideRail />
			<div className="w-[1px] h-screen bg-gray-100 opacity-10"></div>
			<Collections />

			<div className="basis-full flex flex-col p-4 ">
				{/* info bar */}
				<div className="p-4 text-2xl gap-2 flex justify-between w-full">
					<div className="flex gap-2">
						<span className="text-gray-100 text-opacity-25">Collections /</span>
						<span className="">{selection.collection}</span>
					</div>
					{selection.collection && (
						<div className="justify-self-end hover:scale-125 transition-all duration-150 cursor-pointer">
							<Trash2
								color="#e01b24"
								onClick={() => setShowDeleteModal(true)}
							/>
						</div>
					)}
				</div>

				<div className="divider divider-horizontal m-0"></div>

				<div className="basis-full flex gap-2 max-h-screen overflow-y-scroll w-full">
					{/* all docs for the collection */}
					<Documents />

					<div className="w-[1px] h-screen bg-gray-100 opacity-10"></div>

					{/* selected document */}
					<Document />
				</div>
			</div>
		</div>
	);
}

export default App;
