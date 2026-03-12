import { useEffect, useState } from 'react'
import Loader from '../components/Loader.jsx'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { downloadPrescriptionPdfUrl, getPatientPrescriptions } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'

function PatientPrescriptions() {
	const { token } = useAuth()
	const [prescriptions, setPrescriptions] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			try {
				const data = await getPatientPrescriptions(token)
				setPrescriptions(data)
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
					eyebrow="My prescriptions"
					title="Prescription PDFs"
					subtitle="Access and download prescription PDFs shared by your doctors in one secure place."
				/>

				{loading ? <Loader label="Loading prescriptions..." /> : null}
				{error ? <p className="form-message form-message--error">{error}</p> : null}

				<div className="list-stack">
					{prescriptions.map((item) => (
						<article key={item._id} className="list-card">
							<div>
								<strong>Dr. {item?.doctor?.name}</strong>
								<p>{item.careToBeTaken}</p>
							</div>
							<a className="primary-button" href={downloadPrescriptionPdfUrl(item._id)} target="_blank" rel="noreferrer">
								Open PDF
							</a>
						</article>
					))}
				</div>
			</section>
		</main>
	)
}

export default PatientPrescriptions
