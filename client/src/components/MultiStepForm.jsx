import { useState } from 'react'
import StepIndicator from './StepIndicator.jsx'
import FormInput from './FormInput.jsx'
import TextareaField from './TextareaField.jsx'
import PrimaryButton from './PrimaryButton.jsx'

const CONSULTATION_FEE = import.meta.env.VITE_CONSULTATION_FEE || '600'
const PAYMENT_UPI_ID = import.meta.env.VITE_PAYMENT_UPI_ID || 'medcare@upi'
const PAYMENT_QR_URL =
	import.meta.env.VITE_PAYMENT_QR_URL ||
	'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=ONLINE-PRESCRIPTION-PAYMENT'

const initial = {
	currentIllnessHistory: '',
	recentSurgery: '',
	familyDiabeticStatus: 'non-diabetic',
	allergies: '',
	others: '',
	fee: CONSULTATION_FEE,
	transactionId: '',
}

function MultiStepForm({ loading, onSubmit }) {
	const [step, setStep] = useState(1)
	const [form, setForm] = useState(initial)
	const [accepted, setAccepted] = useState(false)

	const onChange = (event) => {
		const { name, value } = event.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const submit = (event) => {
		event.preventDefault()
		if (!accepted) {
			return
		}
		onSubmit(form)
	}

	return (
		<form className="auth-form" onSubmit={submit}>
			<StepIndicator step={step} />

			{step === 1 ? (
				<>
					<TextareaField
						label="Current illness history"
						name="currentIllnessHistory"
						value={form.currentIllnessHistory}
						onChange={onChange}
						required
					/>
					<TextareaField
						label="Recent surgery (time span to be mentioned)"
						name="recentSurgery"
						value={form.recentSurgery}
						onChange={onChange}
					/>
				</>
			) : null}

			{step === 2 ? (
				<>
					<label>
						<span>Diabetics or Non-Diabetics</span>
						<div className="radio-row">
							<label><input type="radio" name="familyDiabeticStatus" value="diabetic" checked={form.familyDiabeticStatus === 'diabetic'} onChange={onChange} /> Diabetic</label>
							<label><input type="radio" name="familyDiabeticStatus" value="non-diabetic" checked={form.familyDiabeticStatus === 'non-diabetic'} onChange={onChange} /> Non-Diabetic</label>
						</div>
					</label>
					<FormInput label="Any allergies" name="allergies" value={form.allergies} onChange={onChange} />
					<FormInput label="Others" name="others" value={form.others} onChange={onChange} />
				</>
			) : null}

			{step === 3 ? (
				<>
					<div className="payment-layout">
						<section className="payment-column">
							<p className="eyebrow">Payment</p>
							<h2 className="section-title">Scan and Pay using UPI App</h2>
							<div className="qr-box">
								<img src={PAYMENT_QR_URL} alt="Payment QR" />
								<p className="section-subtitle">UPI ID: {PAYMENT_UPI_ID}</p>
							</div>
						</section>

						<section className="payment-column">
							<p className="eyebrow">Consultation fee</p>
							<p className="fee-amount">₹{CONSULTATION_FEE}</p>
							<FormInput
								label="Transaction ID"
								name="transactionId"
								value={form.transactionId}
								onChange={onChange}
								required
							/>
						</section>
					</div>

					<div className="consent-box">
						<p className="consent-text">
							I confirm that the consultation details submitted are accurate. I agree to proceed with this paid online consultation.
						</p>
						<label className="consent-check">
							<input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
							I accept
						</label>
					</div>
				</>
			) : null}

			<div className="hero-links">
				{step > 1 ? <PrimaryButton variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</PrimaryButton> : null}
				{step < 3 ? <PrimaryButton onClick={() => setStep((s) => s + 1)}>Next</PrimaryButton> : null}
				{step === 3 ? <PrimaryButton type="submit" disabled={loading || !accepted}>{loading ? 'Submitting...' : 'Submit Appointment'}</PrimaryButton> : null}
			</div>
		</form>
	)
}

export default MultiStepForm
