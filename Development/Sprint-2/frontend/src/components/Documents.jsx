import { useEffect, useState } from "react";
import { ArrowRight, PlusCircle, MinusCircle } from "lucide-react";
import { useAtom } from "jotai";
import { selectionAtom } from "../lib/state/selectionAtom";
import useSwr, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

import { record, z } from "zod";

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

export default function Documents() {
	const [selection, setSelection] = useAtom(selectionAtom);
	const [documentModal, setDocumentModal] = useState(false);
	const { mutate } = useSWRConfig();
	const [doc, setDoc] = useState([
		{
			field: "",
			type: "number",
			value: null,
		},
	]);

	const { data, error, isLoading } = useSwr(
		`${import.meta.env.VITE_BACKEND_URL}/record/list?collection_name=${selection.collection}`,
		fetcher
	);

	const closeModal = () => {
		setDocumentModal(false);
	};

	useEffect(() => {
		console.log("data", data);
		console.log("error", error);
	}, [ data, error, isLoading ]);

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

	const setDocumentSelected = (doc) => {
		setSelection((prev) => ({ ...prev, document: doc }));
	};

	const createDocument = async () => {
		try {

			// const validatedData = fieldSchema.parse(Object.assign({}, ...doc));
			console.log("DOC", doc)
			const data = doc.map((record) => {
				if (record.type === "boolean" && record.value === null) {
					record.value = false;
				}
				return {
					[record.field]: record.value,
				};
			});

			console.log("data in createdocument", data);

			// convert array to object
			const obj = Object.assign({}, ...data);

			console.log("obj", obj);

			// validate data with zod

			console.log({
				collection_name: selection.collection,
				data: obj,
			});
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/record/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					collection_name: selection.collection,
					query: obj,
				}),
			});

			const adsa = await res.json();

			console.log("ADSA",adsa);

			mutate(`${import.meta.env.VITE_BACKEND_URL}/record/list?collection_name=${selection.collection}`);
			setDocumentModal(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			{/* main div */}
			<div className="basis-1/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen overflow-y-scroll ">
				<p>Documents</p>
				<button
					onClick={() => {
						setDocumentModal(true);
					}}
					className="btn btn-outline-primary hover:btn-secondary w-full menu-item duration-75 transition-all"
				>
					New Document
				</button>
				<nav className="menu  p-2 rounded-md">
					<section className="menu-section">
						<ul className="menu-items gap-2">
							{data?.length !== 0 ? (
								data?.data.map((doc) => (
									<li
										key={doc._id}
										className={`menu-item ${
											selection?.document?._id === doc._id
												? "menu-active"
												: null
										} bg-gray-2 flex justify-between`}
										onClick={() => setDocumentSelected(doc)}
									>
										<p>{doc._id}</p>
										<ArrowRight />
									</li>
								))
							) : (
								<li className="p-2 rounded-lg ">
									<p>No documents</p>
								</li>
							)}
						</ul>
					</section>
				</nav>
			</div>

			<label className="hidden btn btn-primary" htmlFor="add-collection-modal">
				Open Modal
			</label>
			<input
				className="hidden modal-state"
				id="add-collection-modal"
				type="checkbox"
				checked={documentModal}
			/>
			{/* Modal */}
			<div className="modal modal-open ">
				<label className="modal-overlay" htmlFor="add-collection-modal"></label>
				<div
					className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 w-2/3 h-3/4`}
				>
					<label
						htmlFor="add-collection-modal"
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
													class="switch switch-primary switch-xl"
													value={record.value}
													onChange={(e) => {
														setDoc((prev) => {
															const newRecord = [...prev];
															newRecord[index].value = e.target.checked ? true: false;
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
															console.log("newRecord[index].value", typeof(newRecord[index].value));
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
							onClick={createDocument}
						>
							Create
						</button>

						<button className="btn btn-block" onClick={closeModal}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

const Input = ({ label, type, value }) => {
	if (type === "boolean") {
		return <input type="checkbox" class="switch switch-primary switch-xl" />;
	} else if (type === "number" || type === "string") {
		return (
			<div className="form-field w-full">
				<label className="form-label">{label}</label>

				<input
					placeholder="Type here"
					type={type}
					className="input max-w-full"
					value={value}
					onChange={onChange}
				/>
				{error && (
					<label className="form-label">
						<span className="form-label-alt">{error}</span>
					</label>
				)}
			</div>
		);
	}
};
