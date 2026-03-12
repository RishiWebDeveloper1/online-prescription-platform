import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doctorSignup } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'
import SectionHeader from '../components/SectionHeader.jsx'
import FormInput from '../components/FormInput.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

const initialState = {
	image: null,
	name: '',
	specialty: '',
	email: '',
	phone: '',
	yearsOfExperience: '',
	password: '',
}

function DoctorSignup() {
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
			const authData = await doctorSignup(form)
			login(authData)
			navigate('/doctor/dashboard')
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="page-shell auth-page auth-page--doctor">
			<section className="auth-card">
				<SectionHeader eyebrow="Doctor access" title="Create doctor account" />
				<form className="auth-form" onSubmit={onSubmit}>
					<label className="file-field">
						<span>Profile picture</span>
						<input name="image" type="file" accept="image/*" onChange={onChange} required />
					</label>

					{previewUrl ? <img className="avatar-preview" src={previewUrl} alt="Doctor preview" /> : null}

					<FormInput label="Name" name="name" value={form.name} onChange={onChange} required />

					<FormInput label="Specialty" name="specialty" value={form.specialty} onChange={onChange} required />

					<div className="grid-two">
						<FormInput label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
						<FormInput label="Phone number" name="phone" value={form.phone} onChange={onChange} required />
					</div>

					<div className="grid-two">
						<FormInput
							label="Years of experience"
							name="yearsOfExperience"
							type="number"
							min="0"
							step="0.1"
							value={form.yearsOfExperience}
							onChange={onChange}
							required
						/>
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

					{error ? <p className="form-message form-message--error">{error}</p> : null}

					<PrimaryButton type="submit" disabled={loading}>
						{loading ? 'Creating account...' : 'Create doctor account'}
					</PrimaryButton>
				</form>

				<p className="form-footer">
					Already registered? <Link to="/doctor/login">Sign in</Link>
				</p>
			</section>
		</main>
	)
}

export default DoctorSignup
