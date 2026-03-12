import { useEffect, useState } from 'react'
import TextareaField from './TextareaField.jsx'
import PrimaryButton from './PrimaryButton.jsx'

function PrescriptionForm({
	onSubmit,
	mode = 'create',
	disabled,
	initialValues,
	doctorName = 'Doctor',
	doctorAddress = 'Medical Center, City',
}) {
	const [form, setForm] = useState({
		careToBeTaken: '',
		medicines: '',
		notes: '',
	})

	useEffect(() => {
		if (initialValues) {
			setForm(initialValues)
		}
	}, [initialValues])

	const onChange = (event) => {
		const { name, value } = event.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const submit = (event) => {
		event.preventDefault()
		onSubmit(form)
	}

	return (
		<form className="auth-form prescription-sheet" onSubmit={submit}>
			<div className="prescription-sheet__top">
				<div>
					<strong>Dr. {doctorName}</strong>
					<p className="section-subtitle">{doctorAddress}</p>
				</div>
				<div>
					<strong>Date</strong>
					<p className="section-subtitle">{new Date().toLocaleDateString('en-GB')}</p>
				</div>
			</div>

			<div className="prescription-sheet__line" />

			<TextareaField
				label="Care to be taken"
				name="careToBeTaken"
				value={form.careToBeTaken}
				onChange={onChange}
				required
				rows={8}
				disabled={disabled}
			/>

			<TextareaField
				label="Medicines"
				name="medicines"
				value={form.medicines}
				onChange={onChange}
				rows={8}
				disabled={disabled}
			/>

			<TextareaField
				label="Notes (optional)"
				name="notes"
				value={form.notes}
				onChange={onChange}
				rows={4}
				disabled={disabled}
			/>

			<div className="prescription-sheet__signature">
				<div>Dr. {doctorName}</div>
				<div>Signature</div>
			</div>

			<PrimaryButton type="submit" disabled={disabled}>
				{mode === 'edit' ? 'Update and resend' : 'Send prescription'}
			</PrimaryButton>
		</form>
	)
}

export default PrescriptionForm
