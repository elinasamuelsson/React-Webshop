import {useState} from "react";

export default function Form({descriptor, onSubmit}) {
	// Bygger startvärdet för formData utifrån descriptorn, en gång
	const initialFormState = {};
	for (let [fieldName, fieldDescription] of Object.entries(descriptor)) {
		initialFormState[fieldName] = fieldDescription.initialValue;
	}

	const [formData, setFormData] = useState(initialFormState);

	// Samma onChange-hanterare för ALLA input-element i formuläret
	function changeData(event) {
		const {name, value} = event.currentTarget;
		setFormData({...formData, [name]: value});
	}

	function handleSubmit(event) {
		event.preventDefault();
		onSubmit(formData);
	}

	return (
		<form onSubmit={handleSubmit}>
			{Object.entries(descriptor).map(([fieldName, fieldDescription]) => {
				const {label, type, required} = fieldDescription;
				const inputAttributes = {
					name: fieldName,
					type,
					required,
					onChange: changeData,
					value: formData[fieldName],
				};

				return (
					<label key={fieldName}>
						<span>{label}:&nbsp;</span>
						<input {...inputAttributes} />
					</label>
				);
			})}

			<button type="submit">Place Order</button>
		</form>
	);
}