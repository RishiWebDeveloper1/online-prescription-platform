import { useEffect, useState } from 'react'
import DoctorCard from '../components/DoctorCard.jsx'
import Loader from '../components/Loader.jsx'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { getDoctors } from '../utils/api.js'

function DoctorsList() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [doctors, setDoctors] = useState([])

	useEffect(() => {
		const loadDoctors = async () => {
			setLoading(true)
			try {
				const data = await getDoctors()
				setDoctors(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		loadDoctors()
	}, [])

	return (
		<main className="page-shell page-shell--top">
			<Navbar />
			<section className="dashboard-card page-wide">
				<SectionHeader eyebrow="Doctor list" title="Find a Doctor" subtitle="Best doctors for you. start consultation today." />

				{loading ? <Loader label="Loading doctors..." /> : null}
				{error ? <p className="form-message form-message--error">{error}</p> : null}

				<div className="doctor-grid">
					{doctors.map((doctor) => (
						<DoctorCard key={doctor._id} doctor={doctor} />
					))}
				</div>
			</section>
		</main>
	)
}

export default DoctorsList
