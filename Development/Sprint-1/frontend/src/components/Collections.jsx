import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectionAtom } from "../lib/state/selection";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";
import { z } from "zod";

// Define a function to validate data types associated with fields
// const dataSchema = z.union([
// 	z.literal("boolean"),
// 	z.literal("number"),
// 	z.literal("string"),
// 	z.literal("object"),
// 	z.literal("array"),
// ]);

// // Define the main schema for an array of objects
// const fieldSchema = z.object({
// 	field: z.string().refine((val) => !/\d|\s|[^A-Za-z]/.test(val), {
// 		message: "Field should not contain numbers, spaces, or special characters.",
// 	}),
// 	type: dataSchema,
// 	data: z.lazy(() => {
// 		return z.union([
// 			z.boolean(),
// 			z.number(),
// 			z.string(),
// 			z.lazy(() => fieldSchema), // For nested objects, refers back to the same schema
// 			z.array(z.lazy(() => fieldSchema)), // For arrays of objects
// 		]);
// 	}),
// });

const collectionNameSchema = z
	.string({
		validation_message: "Collection name must not have spaces",
	})
	.regex(/^[a-zA-Z0-9_]*$/)
	.min(1)
	.max(20);

export default function Collections() {
	const [modal, setModal] = useState(false);
	const [selection, setSelection] = useAtom(selectionAtom);
	const [collectionName, setCollectionName] = useState(null);
	const { mutate } = useSWRConfig();
	// const [record, setRecord] = useState([
	// 	{
	// 		field: "fielder",
	// 		type: "string",
	// 		value: "values",
	// 	},
	// ]);
	const [collectionNameError, setCollectionNameError] = useState(null);

	const { data, error, isLoading } = useSWR(
		"http://0.0.0.0:3690/get_collection_names",
		fetcher
	);

	const setCollectionSelected = (e) => {
		const name = e.target.textContent;
		setSelection((prev) => ({ ...prev, collection: name }));
	};

	useEffect(() => {
		console.log("data", data);
		console.log("error", error);
		console.log("isLoading", isLoading);
	}, [data, error, isLoading]);

	useEffect(() => {
		console.log("modal", modal);
	}, [modal]);

	const closeModal = () => {
		setModal(false);
		setCollectionName(null);
		setCollectionNameError(null);
	};

	const selectCollectionName = (e) => {
		e.preventDefault();
		e.stopPropagation();

		// get value of collectionName from document
		const name = document.querySelector("input[name='collectionName']").value;
		console.log(name);

		// validate collectionName
		try {
			collectionNameSchema.parse(name);
		} catch (err) {
			console.log(err);
			console.log(
				"err.formErrors.fieldErrors.name[0]",
				err.formErrors.fieldErrors.name[0]
			);
			setCollectionNameError(err.formErrors.fieldErrors.name[0]);
			return;
		}

		// set collectionName
		setCollectionName(name);
	};

	const createCollection = async () => {
		// get value of collectionName from document
		const name = document.querySelector("input[name='collectionName']").value;
		console.log(name);

		// validate collectionName
		try {
			collectionNameSchema.parse(name);
		} catch (err) {
			console.log(err);
			console.log(
				"err.formErrors.fieldErrors.name[0]",
				err.formErrors.fieldErrors.name[0]
			);
			setCollectionNameError(err.formErrors.fieldErrors.name[0]);
			return;
		}

		// set collectionName
		try {
			const response = await fetch("http://0.0.0.0:3690/create_collection", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ collection_name: name }),
			});

			const data = await response.json();

			console.log("data", data);

			setModal(false);
			mutate('http://0.0.0.0:3690/get_collection_names');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<label className="hidden btn btn-primary" htmlFor="add-collection-modal">
				Open Modal
			</label>
			<input
				className="hidden modal-state"
				id="add-collection-modal"
				type="checkbox"
				checked={modal}
			/>
			{/* Modal */}
			<div className="modal modal-open overflow-y-scroll">
				<label className="modal-overlay" htmlFor="add-collection-modal"></label>
				<div
					className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 ${
						collectionName ? "w-2/3 h-3/4" : "w-1/4  h-1/4"
					}`}
				>
					<label
						htmlFor="add-collection-modal"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={closeModal}
					>
						✕
					</label>
					<h2 className="text-xl">Add New Collection</h2>

					<div className="basis-full flex flex-col">
						<div className="form-field">
							<label className="form-label">Collection Name</label>

							<input
								placeholder="Type here"
								type="text"
								className="input max-w-full"
								name="collectionName"
								disabled={collectionName ? true : false}
							/>
							{collectionNameError && (
								<label className="form-label">
									<span className="text-red-500">{collectionNameError}</span>
								</label>
							)}
						</div>

						{collectionName && (
							<div className="basis-full rounded-md bg-primary bg-opacity-40 mt-2 p-4 gap-4 flex flex-col ">
								{/* disclaimer */}
								<div>
									<p className="text-sm ">
										Atleast one document needs to be created to create a
										collection
									</p>
								</div>
								{/* records */}
								<div className="flex gap-6 justify-between w-full overflow-scroll">
									{/* {records.map((record, index) => (
										<> */}
									<div className="form-field w-full">
										<label className="form-label">Field</label>

										<input
											placeholder="Type here"
											type="text"
											value={record.field}
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

										<select className="select w-full" value={record.type}>
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

										<input
											placeholder="Type here"
											type="text"
											className="input max-w-full"
											value={record.value}
										/>
										{error?.value && (
											<label className="form-label">
												<span className="form-label-alt">
													error.value.message
												</span>
											</label>
										)}
									</div>
									{/* </>
									))} */}
								</div>
								{/* 
								<div>
									<div className="form-field w-full">
										<label className="form-label">Field</label>

										<input
											placeholder="Type here"
											type="text"
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

										<select className="select w-full">
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

										<input
											placeholder="Type here"
											type="email"
											className="input max-w-full"
										/>
										{error?.value && (
											<label className="form-label">
												<span className="form-label-alt">
													error.value,message
												</span>
											</label>
										)}
									</div>
								</div> */}
							</div>
						)}
					</div>

					<div className="flex gap-3">
						{/* {collectionName !== "" ? (
							<button
								className="btn btn-primary hover:btn-secondary btn-block"
								onClick={selectCollectionName}
							>
								Create
							</button>
						) : ( */}
						<button
							className="btn btn-primary hover:btn-secondary btn-block"
							onClick={createCollection}
						>
							Create
						</button>
						{/* )} */}

						<button className="btn btn-block" onClick={closeModal}>
							Cancel
						</button>
					</div>
				</div>
			</div>
			{/* Bar */}
			<aside className="sidebar h-full justify-start">
				<section className="sidebar-content h-fit min-h-[20rem] overflow-visible mt-10">
					<nav className="menu rounded-md">
						<section className="menu-section px-4">
							<span className="menu-title">Collections</span>
							<ul className="menu-items gap-4">
								<button
									onClick={() => {
										setModal((val) => !val);
									}}
									className="btn btn-outline-primary hover:btn-secondary w-full menu-item shadow-2xl shadow-secondary duration-75 transition-all mt-10"
								>
									New Collection
								</button>
								{data?.length > 0 &&
									data.map((collection, index) => (
										<li
											key={index}
											className={`menu-item ${
												selection.collection === collection
													? "menu-active"
													: null
											}`}
											onClick={setCollectionSelected}
										>
											<span>{collection}</span>
										</li>
									))}
							</ul>
						</section>
					</nav>
				</section>
			</aside>
		</>
	);
}
