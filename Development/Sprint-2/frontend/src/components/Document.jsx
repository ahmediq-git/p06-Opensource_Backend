import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import useSwr, { useSWRConfig } from "swr";
import { selectionAtom } from "../lib/state/selectionAtom";
import JSONPretty from "react-json-pretty";
import { Trash2, MinusCircle, Pencil, PlusCircle } from "lucide-react";
import { fetcher } from "../lib/utils/fetcher";
import "/src/assets/custom.css";
import { isAuthCollection } from "../lib/utils/isAuthCollection";
import { record, z } from "zod";

export default function Documents() {
	const [selection, setSelection] = useAtom(selectionAtom);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const convertToDoc = (originalObject) => {
		const convertedArray = [];
		for (const key in originalObject) {
			if (Object.prototype.hasOwnProperty.call(originalObject, key) && key !== '_id' && key != 'updatedAt' && key != 'createdAt') {
				convertedArray.push({
					field: key,
					type: typeof originalObject[key],
					value: originalObject[key]
				});
			}
		}

		return convertedArray;
	};

	const [doc, setDoc] = useState(convertToDoc(selection.document));

	const { mutate } = useSWRConfig();



	// Define a function to validate data types associated with fields
	const dataSchema = z.union([
		z.literal("boolean"),
		z.literal("number"),
		z.literal("string"),
		z.literal("object"),
		z.literal("array"),
	]);

	// // Define the main schema for an array of objects
	const fieldSchema = z.object({
		field: z.string().refine((val) => {
			/^[a-zA-Z\-_]+$/.test(val.trim());
		}, {
			message: "Field should not contain numbers, spaces, or special characters.",
		}),
		type: dataSchema,
		data: z.lazy(() => {
			return z.union([
				z.boolean(),
				z.number(),
				z.string(),
				z.lazy(() => fieldSchema), // For nested objects, refers back to the same schema
				z.array(z.lazy(() => fieldSchema)), // For arrays of objects
			]);
		}),
	});

	const parseValue = (value, type) => {
		if (type === "boolean") {
			return value === "true";
		} else if (type === "number") {
			return parseFloat(value);
		} else {
			return value;
		}
	};

	useEffect(() => {
		// delay by 1 second and reset on input
		const timeout = setTimeout(() => {
			for (let i = 0; i < doc.length; i++) {
				console.log("doc[i].field", doc[i].field);
				console.log("doc[i].type", doc[i].type);
				console.log("doc[i].value", doc[i].value);
			}
		}, 1000);

		return () => clearTimeout(timeout);

	}, [doc]);


	const deleteDoc = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/record/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					collection_name: selection.collection,
					query: { "_id": selection.document._id },
					queryOptions: {}
				}),
			});

			const data = await res.json();
			console.log(data);

			// remove the deleted collection from the list of collections
			mutate(`${import.meta.env.VITE_BACKEND_URL}/record/list?collection_name=${selection.collection}`);
			setSelection({ collection: "", document: "" });

			setShowDeleteModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	const editDoc = async () => {
		try {
			const data = doc.map((record) => {
				if (record.type === "boolean" && record.value === null) {
					record.value = false;
				}
				return {
					[record.field]: record.value,
				};
			});

			const obj = Object.assign({}, ...data);

			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/record/update`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					collection_name: selection.collection,
					id: { "_id": selection.document._id },
					new_record: obj,
				}),
			});

			const adsa = await res.json();
			console.log("return is", adsa);

			// remove the deleted collection from the list of collections
			mutate(`${import.meta.env.VITE_BACKEND_URL}/record/list?collection_name=${selection.collection}`);
			setSelection({ collection: "", document: "" });

			setShowEditModal(false);
		} catch (error) {
			console.log(error);
		}
	}


	const { data, error, isLoading } = useSwr(
		`${import.meta.env.VITE_BACKEND_URL}/record/list?collection_name=${selection.collection}`,
		fetcher
	);

	const closeModal = () => {
		setShowEditModal(false);
	};

	useEffect(() => {
		console.log("data", data);
		console.log("error", error);
	}, [data, error, isLoading]);


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

			{/* Delete Modal */}
			<div className="modal modal-open overflow-y-scroll">
				<label
					className="modal-overlay"
					htmlFor="delete-collection-modal"
				></label>
				<div
					className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 w-2/5  
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

			{/* Edit Modal */}
			<label className="hidden btn btn-primary" htmlFor="edit-collection-modal">
				Open Modal
			</label>
			<input
				className="hidden modal-state"
				id="edit-collection-modal"
				type="checkbox"
				checked={showEditModal}
			/>
			{/* Modal */}
			<div className="modal modal-open ">
				<label className="modal-overlay" htmlFor="edit-collection-modal"></label>
				<div
					className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 w-2/3 h-3/4`}
				>
					<label
						htmlFor="edit-collection-modal"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={closeModal}
					>
						✕
					</label>
					<h2 className="text-xl">Add New Record</h2>

					<div className="basis-full flex flex-col overflow-y-scroll">
						<div className="basis-full rounded-md bg-opacity-40 mt-2 p-4 gap-4 flex flex-col ">
							{/* records */}
							<div className="flex flex-col gap-6 justify-between w-full overflow-scroll">
								{console.log(doc)}
								{doc.map((record, index) => (
									<div
										key={index}
										className="flex gap-6 justify-between items-end"
									>
										<div className="form-field w-full">
											<label className="form-label">Field</label>

											<input
												placeholder="Type here"
												type="text"
												value={record.field}
												onChange={(e) => {
													setDoc((prev) => {
														const newRecord = [...prev];
														newRecord[index].field = e.target.value;
														return newRecord;
													});
												}}
												className="input max-w-full"
											/>
											{error?.field && (
												<label className="form-label">
													<span className="form-label-alt">
														error.field.message
													</span>
												</label>
											)}
										</div>
										<div className="form-field w-full">
											<label className="form-label">Type</label>

											<select
												className="select w-full"
												value={record.type}
												onChange={(e) => {
													setDoc((prev) => {
														const newRecord = [...prev];
														newRecord[index].type = e.target.value;
														console.log("newRecord[index].type", newRecord[index].type);
														return newRecord;
													});
												}}
											>
												<option value="boolean">bool</option>
												<option value="number">number</option>
												<option value="string">string</option>
												<option value="array">array</option>
												<option value="object">object</option>
											</select>
											{error?.type && (
												<label className="form-label">
													<span className="form-label-alt">
														error.type.message
													</span>
												</label>
											)}
										</div>
										<div className="form-field w-full">
											<label className="form-label">Value</label>

											{record.type === "boolean" ? (
												<input
													type="checkbox"
													className="switch switch-primary switch-xl"
													value={record.value}
													onChange={(e) => {
														setDoc((prev) => {
															const newRecord = [...prev];
															newRecord[index].value = e.target.checked ? true : false;
															return newRecord;
														});
													}}
												/>
											) : (
												<input
													placeholder="Type here"
													type={record.type}
													className="input max-w-full"
													value={record.value}
													onChange={(e) => {
														setDoc((prev) => {
															const newRecord = [...prev];
															newRecord[index].value = parseValue(e.target.value, record.type);
															console.log("newRecord[index].value", typeof (newRecord[index].value));
															return newRecord;
														});
													}}
												/>
											)}
											{error?.value && (
												<label className="form-label">
													<span className="form-label-alt">
														error.value.message
													</span>
												</label>
											)}
										</div>

										<button
											className="p-4 text-gray-200 flex w-32 gap-2 btn "
											onClick={() => {
												setDoc((prev) => {
													const newRecord = [...prev];
													newRecord.splice(index, 1);
													return newRecord;
												});
											}}
										>
											<MinusCircle />
										</button>
									</div>
								))}
								<button
									className="p-4 text-gray-200 flex w-32 gap-2 btn "
									onClick={() => {
										setDoc((prev) => [
											...prev,
											{
												field: "",
												type: "number",
												value: "",
											},
										]);
									}}
								>
									<PlusCircle />
								</button>
							</div>
						</div>
					</div>

					<div className="flex gap-3">
						<button
							className="btn btn-primary hover:btn-secondary btn-block"
							onClick={editDoc}
						>
							Save Edit
						</button>

						<button className="btn btn-block" onClick={closeModal}>
							Cancel
						</button>
					</div>
				</div>
			</div>

			<div className="basis-3/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen h-full overflow-y-scroll">
				<div className="flex justify-between">
					<div className="flex justiy-between">
						<p className="grow w-full">Document</p>
						{selection.collection &&
							(<Pencil
								onClick={() => setShowEditModal(true)}
								className="ml-2 hover:scale-105" cursor="pointer"
							/>)
						}
					</div>

					{selection.collection && (
						<div className="justify-self-end self-end transition-all duration-150 cursor-pointer">
							<Trash2
								color="#e01b24"
								onClick={() => setShowDeleteModal(true)}
							/>
						</div>
					)}
				</div>
				<div className="flex justify-between items-center w-full bg-neutral-950">
					{/* <pre className="w-full"> {JSON.stringify(selection.document, null, 2)}</pre> */}

					<JSONPretty
						id="doc"
						data={selection.document}
						style={{
							width: "100%",
							padding: "2rem",
							backgroundColor: "#171717",
							borderRadius: "0.5rem",
						}}
					></JSONPretty>
				</div>
			</div>
		</>
	);
}
