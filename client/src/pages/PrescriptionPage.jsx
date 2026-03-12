import { useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader.jsx'
import PrescriptionForm from '../components/PrescriptionForm.jsx'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { createPrescription, downloadPrescriptionPdfUrl, getDoctorConsultations, getDoctorPrescriptions, updatePrescription } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'

function PrescriptionPage() {
	const { token, user } = useAuth()
	const [consultations, setConsultations] = useState([])
	const [prescriptions, setPrescriptions] = useState([])
	const [selectedConsultationId, setSelectedConsultationId] = useState('')
	const [editingPrescriptionId, setEditingPrescriptionId] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const refresh = async () => {
		setLoading(true)
		try {
			const [consultData, prescriptionData] = await Promise.all([
				getDoctorConsultations(token),
				getDoctorPrescriptions(token),
			])
			setConsultations(consultData)
			setPrescriptions(prescriptionData)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		refresh()
	}, [token])

	const consultationOptions = useMemo(
		() => consultations.filter((item) => item.status !== 'cancelled'),
		[consultations]
	)

	const selectedPrescription = useMemo(
		() => prescriptions.find((item) => item._id === editingPrescriptionId),
		[prescriptions, editingPrescriptionId]
	)

	const onSubmit = async (form) => {
		setError('')
		try {
			if (editingPrescriptionId) {
				await updatePrescription(token, editingPrescriptionId, form)
			} else {
				await createPrescription(token, {
					consultationId: selectedConsultationId,
					...form,
				})
			}

			setEditingPrescriptionId('')
			await refresh()
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<main className="page-shell page-shell--top">
			<Navbar />
			<section className="dashboard-card page-wide">
				<SectionHeader
					eyebrow="Prescription page"
					title="Create and manage prescriptions"
					subtitle="Write prescriptions, generate PDF files, and resend updated prescriptions to patients."
				/>

				{loading ? <Loader label="Loading data..." /> : null}
				{error ? <p className="form-message form-message--error">{error}</p> : null}

				{!loading ? (
					<>
						{!editingPrescriptionId ? (
							<label>
								<span>Select consultation</span>
								<select
									className="native-select"
									value={selectedConsultationId}
									onChange={(event) => setSelectedConsultationId(event.target.value)}
								>
									<option value="">Choose consultation</option>
									{consultationOptions.map((item) => (
										<option key={item._id} value={item._id}>
											{item?.patient?.name} - {item.currentIllnessHistory || item.symptoms}
										</option>
									))}
								</select>
							</label>
						) : null}

						<PrescriptionForm
							disabled={!editingPrescriptionId && !selectedConsultationId}
							doctorName={user?.name || 'Doctor'}
							doctorAddress="City Medical Center, Healthcare Avenue"
							initialValues={
								selectedPrescription
									? {
										careToBeTaken: selectedPrescription.careToBeTaken || '',
										medicines: selectedPrescription.medicines || '',
										notes: selectedPrescription.notes || '',
									}
									: undefined
							}
							mode={editingPrescriptionId ? 'edit' : 'create'}
							onSubmit={onSubmit}
						/>

						<h2 className="section-title">Already sent prescriptions</h2>
						<div className="list-stack">
							{prescriptions.map((item) => (
								<article className="list-card" key={item._id}>
									<div>
										<strong>{item?.patient?.name}</strong>
										<p>{item.careToBeTaken}</p>
									</div>
									<div className="hero-links">
										<button className="secondary-button" type="button" onClick={() => setEditingPrescriptionId(item._id)}>
											Edit
										</button>
										<a
											className="primary-button"
											href={downloadPrescriptionPdfUrl(item._id)}
											target="_blank"
											rel="noreferrer"
											onClick={(event) => {
												event.preventDefault()
												window.open(downloadPrescriptionPdfUrl(item._id), '_blank', 'noopener,noreferrer')
											}}
										>
											View PDF
										</a>
									</div>
								</article>
							))}
						</div>
					</>
				) : null}
			</section>
		</main>
	)
}

export default PrescriptionPage
