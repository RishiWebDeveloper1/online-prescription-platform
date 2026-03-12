import { Link } from 'react-router-dom'
import { getAvatarUrl } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'

function DoctorDashboard() {
	const { user } = useAuth()

	return (
		<main className="page-shell page-shell--top dashboard-page dashboard-page--doctor">
			<Navbar />
			<section className="dashboard-card dashboard-card--doctor page-wide">
				<div className="dashboard-header">
					<SectionHeader
						eyebrow="Doctor dashboard"
						title={`Welcome, ${user?.name}`}
						subtitle="Manage consultations and publish prescriptions for your patients."
					/>
					<img className="dashboard-avatar" src={getAvatarUrl('doctor', user?.id)} alt={user?.name} />
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
					<Link to="/doctor/profile">Profile</Link>
					<Link to="/doctor/consultations">Consultations</Link>
					<Link to="/doctor/prescriptions">Prescription page</Link>
				</div>
			</section>
		</main>
	)
}

export default DoctorDashboard
