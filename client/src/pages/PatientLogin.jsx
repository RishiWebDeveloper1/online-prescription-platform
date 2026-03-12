import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { patientLogin } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'
import SectionHeader from '../components/SectionHeader.jsx'
import FormInput from '../components/FormInput.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

function PatientLogin() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [form, setForm] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onChange = (event) => {
		const { name, value } = event.target
		setForm((current) => ({ ...current, [name]: value }))
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setLoading(true)

		try {
			const authData = await patientLogin(form)
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
			<section className="auth-card compact-card">
				<SectionHeader eyebrow="Patient access" title="Sign in" />

				<form className="auth-form" onSubmit={onSubmit}>
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

					{error ? <p className="form-message form-message--error">{error}</p> : null}

					<PrimaryButton type="submit" disabled={loading}>
						{loading ? 'Signing in...' : 'Sign in'}
					</PrimaryButton>
				</form>

				<p className="form-footer">
					Need an account? <Link to="/patient/signup">Patient sign up</Link>
				</p>
			</section>
		</main>
	)
}

export default PatientLogin
