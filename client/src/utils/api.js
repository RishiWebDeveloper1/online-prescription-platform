const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

async function parseResponse(response) {
	const data = await response.json().catch(() => ({}))

	if (!response.ok) {
		throw new Error(data.message || 'Request failed')
	}

	return data
}

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, options)
	return parseResponse(response)
}

function buildFormData(payload) {
	const formData = new FormData()

	Object.entries(payload).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') {
			return
		}

		formData.append(key, value)
	})

	return formData
}

export async function doctorSignup(payload) {
	const response = await fetch(`${API_BASE_URL}/auth/doctor/signup`, {
		method: 'POST',
		body: buildFormData(payload),
	})

	return parseResponse(response)
}

export async function doctorLogin(payload) {
	const response = await fetch(`${API_BASE_URL}/auth/doctor/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})

	return parseResponse(response)
}

export async function patientSignup(payload) {
	const response = await fetch(`${API_BASE_URL}/auth/patient/signup`, {
		method: 'POST',
		body: buildFormData(payload),
	})

	return parseResponse(response)
}

export async function patientLogin(payload) {
	const response = await fetch(`${API_BASE_URL}/auth/patient/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})

	return parseResponse(response)
}

export function getAvatarUrl(role, userId) {
	if (!userId || !role) {
		return ''
	}

	const baseSegment = role === 'doctor' ? 'doctors' : 'patients'
	return `${API_BASE_URL}/${baseSegment}/${userId}/avatar`
}

function authHeaders(token, extra = {}) {
	return {
		Authorization: `Bearer ${token}`,
		...extra,
	}
}

export function getApiBaseUrl() {
	return API_BASE_URL
}

export function downloadPrescriptionPdfUrl(id) {
	return `${API_BASE_URL}/prescriptions/${id}/pdf`
}

export async function getDoctors() {
	return request('/doctors')
}

export async function getDoctorById(id) {
	return request(`/doctors/${id}`)
}

export async function createConsultation(token, payload) {
	return request('/consultations', {
		method: 'POST',
		headers: authHeaders(token, { 'Content-Type': 'application/json' }),
		body: JSON.stringify(payload),
	})
}

export async function getPatientConsultations(token) {
	return request('/consultations/patient', {
		headers: authHeaders(token),
	})
}

export async function getDoctorConsultations(token) {
	return request('/consultations/doctor', {
		headers: authHeaders(token),
	})
}

export async function getDoctorPrescriptions(token) {
	return request('/prescriptions/doctor', {
		headers: authHeaders(token),
	})
}

export async function getPatientPrescriptions(token) {
	return request('/prescriptions/my', {
		headers: authHeaders(token),
	})
}

export async function createPrescription(token, payload) {
	return request('/prescriptions', {
		method: 'POST',
		headers: authHeaders(token, { 'Content-Type': 'application/json' }),
		body: JSON.stringify(payload),
	})
}

export async function updatePrescription(token, id, payload) {
	return request(`/prescriptions/${id}`, {
		method: 'PUT',
		headers: authHeaders(token, { 'Content-Type': 'application/json' }),
		body: JSON.stringify(payload),
	})
}
