import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MultiStepForm from '../components/MultiStepForm.jsx'
import Navbar from '../components/Navbar.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { createConsultation } from '../utils/api.js'
import { useAuth } from '../hooks/useAuth.js'

function ConsultationForm() {
	const navigate = useNavigate()
	const { doctorId } = useParams()
	const { token } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onSubmit = async (formData) => {
		setError('')
		setLoading(true)

		try {
			await createConsultation(token, {
				doctorId,
				symptoms: formData.currentIllnessHistory,
				currentIllnessHistory: formData.currentIllnessHistory,
				recentSurgery: formData.recentSurgery,
				familyDiabeticStatus: formData.familyDiabeticStatus,
				allergies: formData.allergies,
				otherFamilyHistory: formData.others,
				transactionId: formData.transactionId,
				fee: Number(formData.fee || 0),
			})

			navigate('/patient/dashboard')
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="page-shell page-shell--top">
			<Navbar />
			<section className="dashboard-card page-wide">
				<SectionHeader
					eyebrow="Consultation"
					title="Consultation details"
					subtitle="Fill each step carefully and complete payment to submit appointment request."
				/>
				<MultiStepForm loading={loading} onSubmit={onSubmit} />
				{error ? <p className="form-message form-message--error">{error}</p> : null}
			</section>
		</main>
	)
}

export default ConsultationForm
