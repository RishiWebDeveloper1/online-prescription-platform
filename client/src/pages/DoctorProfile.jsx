import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { getAvatarUrl, getDoctorById } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'

function DoctorProfile() {
	const { user } = useAuth()
	const [doctor, setDoctor] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				const data = await getDoctorById(user.id)
				setDoctor(data)
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [user.id])

	if (loading) {
		return <Loader label="Loading profile..." />
	}

	return (
		<main className="page-shell page-shell--top">
			<Navbar />
			<section className="dashboard-card page-wide">
				<SectionHeader eyebrow="Doctor profile" title={doctor?.name || 'Doctor profile'} />

				<div className="profile-grid">
					<img className="profile-avatar" src={getAvatarUrl('doctor', user.id)} alt={doctor?.name} />
					<div className="profile-info">
						<p><strong>Specialty:</strong> {doctor?.specialty}</p>
						<p><strong>Email:</strong> {doctor?.email}</p>
						<p><strong>Phone:</strong> {doctor?.phone}</p>
						<p><strong>Experience:</strong> {doctor?.yearsOfExperience} years</p>
						<Link className="primary-button" to="/doctor/prescriptions">Go to prescription page</Link>
					</div>
				</div>
			</section>
		</main>
	)
}

export default DoctorProfile
