import { Link } from 'react-router-dom'
import { getAvatarUrl } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'

function PatientDashboard() {
	const { user } = useAuth()

	return (
		<main className="page-shell page-shell--top dashboard-page dashboard-page--patient">
			<Navbar />
			<section className="dashboard-card dashboard-card--patient page-wide">
				<div className="dashboard-header">
					<SectionHeader
						eyebrow="Patient dashboard"
						title={`Welcome, ${user?.name}`}
						subtitle="Easily consult doctors, update your medical history, and view or download your prescriptions."
					/>
					<img className="dashboard-avatar" src={getAvatarUrl('patient', user?.id)} alt={user?.name} />
				</div>

				<div className="dashboard-grid">
					<article className="summary-card">
						<span>Role</span>
						<strong>{user?.role}</strong>
					</article>
					<article className="summary-card">
						<span>Email</span>
						<strong>{user?.email}</strong>
					</article>
				</div>

				<div className="hero-links">
					<Link to="/patient/doctors">View doctors</Link>
					<Link to="/patient/prescriptions">My prescriptions</Link>
				</div>
			</section>
		</main>
	)
}

export default PatientDashboard
