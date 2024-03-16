import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

const ObjectFieldForm = ({index, setDoc, error, existingObject=null }) => {

	const [fields, setFields] = useState(existingObject === null ? [] : existingObject);

	const handleRowChange = (key, newValue, fieldIndex, type) => {
		const updatedFields = [...fields];
		updatedFields[fieldIndex] = {key: key, type: type, value: parseValue(newValue, type) }
		setFields(updatedFields);
		updateDocument(updatedFields);
	};

	const addNewRow = () => {
		const updatedFields = [...fields, { key: "", value: parseValue("true", "boolean"), type: "boolean" }];
		setFields(updatedFields);
		updateDocument(updatedFields);
	};

	const removeRow = (fieldIndex) => {
		const updatedFields = [...fields];
		updatedFields.splice(fieldIndex, 1);
		setFields(updatedFields);
		updateDocument(updatedFields);
	};

	const updateDocument = (updatedFields) => {
		setDoc((prev) => {
			const newRecord = [...prev];
			newRecord[index].value = updatedFields.reduce((acc, field) => {
                acc[field.key] = field.value;
                return acc;
            }, {});
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
							<div className="form-field w-full">
								<label className="form-label">Field</label>

								<input
									placeholder="Type here"
									type="text"
                                    value={field.key}
									onChange={(e) => handleRowChange(e.target.value, "", fieldIndex, field.type)}
									className="input max-w-full"
								/>
								{/* {error?.field && (
								<label className="form-label">
									<span className="form-label-alt">
									error.field.message
									</span>
								</label>)} */}

							</div>

							<div className="form-field w-full">
								<label className="form-label">Type</label>
								<select
									className="select w-full"
									value={field.type}
									onChange={(e) =>
										handleRowChange(field.key, e.target.value === "boolean" ? false : e.target.value === "number" ? 0 : "", fieldIndex, e.target.value)
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
										onChange={(e) => handleRowChange(field.key, e.target.value, fieldIndex, field.type)}
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
										onChange={(e) => handleRowChange(field.key, e.target.value, fieldIndex, field.type)}
										className="input max-w-full"
									/>
								) : (
									<input
                                        value={field.value}
										placeholder="Type here"
										type="text"
										onChange={(e) => handleRowChange(field.key, e.target.value, fieldIndex, field.type)}
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

export default ObjectFieldForm;