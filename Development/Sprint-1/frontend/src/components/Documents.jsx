import { useEffect, useState } from "react";
import { ArrowRight, PlusCircle, MinusCircle } from "lucide-react";
import { useAtom } from "jotai";
import { selectionAtom } from "../lib/state/selection";
import useSwr, { useSWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Documents() {
	const [selection, setSelection] = useAtom(selectionAtom);
	const [documentModal, setDocumentModal] = useState(false);
	const { mutate } = useSWRConfig();
	const [doc, setDoc] = useState([
		{
			field: "",
			type: "number",
			value: "",
		},
	]);

	const { data, error } = useSwr(
		`http://127.0.0.1:3690/get_all_docs/${selection.collection}`,
		fetcher
	);

	const closeModal = () => {
		setDocumentModal(false);
	};

	useEffect(() => {
		console.log("data", data);
		console.log("error", error);
		console.log("record", doc.length);
	}, [data, error, doc]);

	const setDocumentSelected = (doc) => {
		setSelection((prev) => ({ ...prev, document: doc }));
	};

	const createDocument = async () => {
		try {
			const data = doc.map((record) => {
				return {
					[record.field]: record.value,
				};
			});

			// convert array to object
			const obj = Object.assign({}, ...data);

			console.log({
				collection_name: selection.collection,
				data: obj,
			});
			const res = await fetch(`http://127.0.0.1:3690/insert_doc_multifield`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					collection_name: selection.collection,
					data: obj,
				}),
			});

			const adsa = await res.json();

			console.log(adsa);

			mutate(`http://127.0.0.1:3690/get_all_docs/${selection.collection}`);
			setDocumentModal(false);

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

											<input
												placeholder="Type here"
												type="text"
												className="input max-w-full"
												value={record.value}
												onChange={(e) => {
													setDoc((prev) => {
														const newRecord = [...prev];
														newRecord[index].value = e.target.value;
														return newRecord;
													});
												}}
											/>
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
			<div className="basis-1/4 w-full p-4 rounded-sm  gap-4 flex flex-col max-h-screen overflow-y-scroll">
				<p>Documents</p>
				<button
					onClick={() => {
						setDocumentModal(true);
					}}
					className="btn btn-outline-primary hover:btn-secondary w-full menu-item shadow-2xl shadow-secondary duration-75 transition-all"
				>
					New Document
				</button>
				<nav className="menu  p-2 rounded-md">
					<section className="menu-section">
						<ul className="menu-items gap-2">
							{data?.length !== 0 ? (
								data?.map((doc) => (
									<li
										key={doc._id.$oid}
										className={`menu-item ${
											selection?.document?._id?.$oid === doc._id.$oid
												? "menu-active"
												: null
										} bg-gray-2 flex justify-between`}
										onClick={() => setDocumentSelected(doc)}
									>
										<p>{doc._id.$oid}</p>
										<ArrowRight />
									</li>
								))
							) : (
								<li className="menu-item bg-gray-2 flex justify-between">
									<p>No documents</p>
								</li>
							)}
						</ul>
					</section>
				</nav>
			</div>
		</>
	);
}
