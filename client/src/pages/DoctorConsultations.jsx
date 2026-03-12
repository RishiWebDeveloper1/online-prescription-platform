import { useEffect, useState } from 'react'
import ConsultationTable from '../components/ConsultationTable.jsx'
import Loader from '../components/Loader.jsx'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { getDoctorConsultations } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'

function DoctorConsultations() {
	const { token } = useAuth()
	const [consultations, setConsultations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			try {
				const data = await getDoctorConsultations(token)
				setConsultations(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [token])

	return (
		<main className="page-shell page-shell--top">
			<Navbar />
			<section className="dashboard-card page-wide">
				<SectionHeader
					eyebrow="Consultation submissions"
					title="Patient consultation requests"
					subtitle="View patient consultation requests, including symptoms, surgery history, allergies, and payment transaction details."
				/>
				{loading ? <Loader label="Loading consultations..." /> : null}
				{error ? <p className="form-message form-message--error">{error}</p> : null}
				{!loading ? <ConsultationTable consultations={consultations} /> : null}
			</section>
		</main>
	)
}

export default DoctorConsultations
