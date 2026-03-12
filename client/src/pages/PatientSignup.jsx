import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { patientSignup } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'
import SectionHeader from '../components/SectionHeader.jsx'
import FormInput from '../components/FormInput.jsx'
import TextareaField from '../components/TextareaField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

const initialState = {
	image: null,
	name: '',
	age: '',
	email: '',
	phone: '',
	surgeryHistory: '',
	illnessHistory: '',
	password: '',
}

const toItems = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)

function PatientSignup() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [form, setForm] = useState(initialState)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const previewUrl = useMemo(() => {
		if (!form.image) {
			return ''
		}

		return URL.createObjectURL(form.image)
	}, [form.image])

	const surgeries = useMemo(() => toItems(form.surgeryHistory), [form.surgeryHistory])
	const illnesses = useMemo(() => toItems(form.illnessHistory), [form.illnessHistory])

	const onChange = (event) => {
		const { name, value, files } = event.target
		setForm((current) => ({
			...current,
			[name]: files ? files[0] : value,
		}))
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setLoading(true)

		try {
			const authData = await patientSignup(form)
			login(authData)
			navigate('/patient/dashboard')
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="page-shell auth-page auth-page--patient">
			<section className="auth-card">
				<SectionHeader eyebrow="Patient access" title="Create patient account" />

				<form className="auth-form" onSubmit={onSubmit}>
					<label className="file-field">
						<span>Profile picture</span>
						<input name="image" type="file" accept="image/*" onChange={onChange} required />
					</label>

					{previewUrl ? <img className="avatar-preview" src={previewUrl} alt="Patient preview" /> : null}

					<FormInput label="Name" name="name" value={form.name} onChange={onChange} required />

					<div className="grid-two">
						<FormInput label="Age" name="age" type="number" min="0" value={form.age} onChange={onChange} required />
						<FormInput label="Phone number" name="phone" value={form.phone} onChange={onChange} required />
					</div>

					<div className="grid-two">
						<FormInput label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
						<FormInput
							label="Password"
							name="password"
							type="password"
							value={form.password}
							onChange={onChange}
							showPasswordToggle
							required
						/>
					</div>

					<TextareaField
						label="History of surgery"
						name="surgeryHistory"
						value={form.surgeryHistory}
						onChange={onChange}
						placeholder="Appendectomy, Knee surgery"
					/>

					{surgeries.length ? (
						<div className="history-panel">
							<strong>Surgery panel</strong>
							<div className="tag-list">
								{surgeries.map((item) => (
									<span className="tag" key={item}>{item}</span>
								))}
							</div>
						</div>
					) : null}

					<TextareaField
						label="History of illness"
						name="illnessHistory"
						value={form.illnessHistory}
						onChange={onChange}
						placeholder="Diabetes, Migraine"
					/>

					{illnesses.length ? (
						<div className="history-panel">
							<strong>Illness panel</strong>
							<div className="tag-list">
								{illnesses.map((item) => (
									<span className="tag" key={item}>{item}</span>
								))}
							</div>
						</div>
					) : null}

					{error ? <p className="form-message form-message--error">{error}</p> : null}

					<PrimaryButton type="submit" disabled={loading}>
						{loading ? 'Creating account...' : 'Create patient account'}
					</PrimaryButton>
				</form>

				<p className="form-footer">
					Already registered? <Link to="/patient/login">Sign in</Link>
				</p>
			</section>
		</main>
	)
}

export default PatientSignup
