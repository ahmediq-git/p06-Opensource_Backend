import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { selectionAtom } from "../lib/state/selectionAtom";

const ArrayFieldForm = ({index, setDoc, error, existingArray=null }) => {

	const [fields, setFields] = useState(existingArray === null ? [] : existingArray);

	const handleRowChange = (newValue, fieldIndex, type) => {
		const updatedFields = [...fields];
		updatedFields[fieldIndex] = {value: parseValue(newValue, type), type: type}
		setFields(updatedFields);
		updateDocument(updatedFields);
	};

	const addNewRow = () => {
		const updatedFields = [...fields, { value: parseValue("true", "boolean"), type: "boolean" }];
		setFields(updatedFields);
		updateDocument(updatedFields);
	};

	const removeRow = (fieldIndex) => {
		// const updatedFields = [...fields];
		// updatedFields.splice(fieldIndex, 1);
		// setFields(updatedFields);
		// updateDocument(updatedFields);
		const updatedFields = fields.filter((_, index) => index !== fieldIndex);
		setFields(updatedFields);
		updateDocument(updatedFields);
	};

	const updateDocument = (updatedFields) => {
		setDoc((prev) => {
			const newRecord = [...prev];
			newRecord[index].value = updatedFields.map(field => field.value);
			return newRecord;
		});
	};

	const parseValue = (value, type) => {
		if (type === "boolean") {
			return value === "true";
		} else if (type === "number") {
			return parseFloat(value);
		} else {
			return value;
		}
	};

	return (
		<div>
			{fields.map((field, fieldIndex) => (
				<div className="flex flex-row items-center" key={fieldIndex}>
					<div className="ml-4">
						<div className="form-field w-auto flex flex-row items-center my-2">
							<div className="mt-7">{fieldIndex}</div>
							{/* <div className="form-field w-full">
								<label className="form-label">Field</label>

								<input
									placeholder="Type here"
									type="text"
									onChange={(e) => handleRowChange(e.target.value, fieldIndex)}
									className="input max-w-full"
								/>
								 {error?.field && (
								<label className="form-label">
									<span className="form-label-alt">
									error.field.message
									</span>
								</label>)}

							</div> */}

							<div className="form-field w-full">
								<label className="form-label">Type</label>
								<select
									className="select max-w-full"
									value={field.type}
									onChange={(e) =>
										handleRowChange(e.target.value === "boolean" ? false : e.target.value === "number" ? 0 : "", fieldIndex, e.target.value)
									}
								>
									<option value="boolean">bool</option>
									<option value="number">number</option>
									<option value="string">string</option>
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
								{field.type === 'boolean' ? (
									<select
										value={field.value}
										onChange={(e) => handleRowChange(e.target.value, fieldIndex, field.type)}
										className="input max-w-full"
									>
										<option value="true">True</option>
										<option value="false">False</option>
									</select>
								) : field.type === 'number' ? (
									<input
										value={field.value}
										placeholder="Type here"
										type="number"
										onChange={(e) => handleRowChange(e.target.value, fieldIndex, field.type)}
										className="input max-w-full"
									/>
								) : (
									<input
										value={field.value}
										placeholder="Type here"
										type="text"
										onChange={(e) => handleRowChange(e.target.value, fieldIndex, field.type)}
										className="input max-w-full"
									/>
								)}
							</div>

							<button
								className="p-4 text-gray-200 flex w-32 gap-2 btn mt-6 ml-2"
								onClick={() => removeRow(fieldIndex)}
							>
								<MinusCircle />
							</button>
						</div>
					</div>
				</div>
			))}
			<button className="ml-4 mt-2 p-4 text-gray-200 flex w-32 gap-2 btn" onClick={addNewRow}>
				
				<PlusCircle/>
				<div>Add Field</div>
			</button>
		</div>
	);
};

export default ArrayFieldForm;