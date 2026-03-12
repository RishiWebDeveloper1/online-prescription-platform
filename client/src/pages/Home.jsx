import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import SectionHeader from '../components/SectionHeader.jsx'

function Home() {
	const { user } = useAuth()

	if (user) {
		return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />
	}

	return (
		<main className="page-shell auth-page">
			<section className="hero-card">
				<SectionHeader
					eyebrow="Online Prescription Platform"
					title="Welcome to the medical portal"
					subtitle="Secure doctor and patient onboarding with consultation and prescription workflows."
				/>

				<div className="hero-actions">
					<Link className="action-card action-card--doctor" to="/doctor/signup">
						<span>Doctor</span>
						<strong>Sign up / Sign in</strong>
					</Link>
					<Link className="action-card action-card--patient" to="/patient/signup">
						<span>Patient</span>
						<strong>Sign up / Sign in</strong>
					</Link>
				</div>
				<div className="hero-links">
					<Link to="/doctor/login">Doctor sign in</Link>
					<Link to="/patient/login">Patient sign in</Link>
				</div>
			</section>
		</main>
	)
}

export default Home
