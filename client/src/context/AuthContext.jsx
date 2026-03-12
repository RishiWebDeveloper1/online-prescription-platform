import { createContext, useEffect, useState } from 'react'

const STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'online-prescription-auth'
const EMPTY_AUTH_STATE = { token: '', user: null }

export const AuthContext = createContext(null)

function decodeJwtPayload(token) {
	if (!token || typeof token !== 'string') {
		return null
	}

	const parts = token.split('.')
	if (parts.length !== 3) {
		return null
	}

	try {
		const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
		const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
		const decoded = atob(padded)
		return JSON.parse(decoded)
	} catch {
		return null
	}
}

function isTokenExpired(token) {
	const payload = decodeJwtPayload(token)

	if (!payload || typeof payload.exp !== 'number') {
		return true
	}

	return payload.exp * 1000 <= Date.now()
}

function getInitialAuthState() {
	const saved = localStorage.getItem(STORAGE_KEY)

	if (!saved) {
		return EMPTY_AUTH_STATE
	}

	try {
		const parsed = JSON.parse(saved)
		if (!parsed?.token || !parsed?.user || isTokenExpired(parsed.token)) {
			return EMPTY_AUTH_STATE
		}

		return parsed
	} catch {
		return EMPTY_AUTH_STATE
	}
}

export function AuthProvider({ children }) {
	const [authState, setAuthState] = useState(getInitialAuthState)

	const isAuthenticated = Boolean(authState.token && authState.user && !isTokenExpired(authState.token))

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(authState))
	}, [authState])

	useEffect(() => {
		if (!authState.token || !authState.user) {
			return
		}

		if (isTokenExpired(authState.token)) {
			setAuthState(EMPTY_AUTH_STATE)
			return
		}

		const payload = decodeJwtPayload(authState.token)
		const expiryMs = payload?.exp ? payload.exp * 1000 : Date.now()
		const timeoutMs = Math.max(expiryMs - Date.now(), 0)

		const timerId = window.setTimeout(() => {
			setAuthState(EMPTY_AUTH_STATE)
		}, timeoutMs)

		return () => {
			window.clearTimeout(timerId)
		}
	}, [authState.token, authState.user])

	const login = ({ token, user }) => {
		if (!token || !user || isTokenExpired(token)) {
			setAuthState(EMPTY_AUTH_STATE)
			return
		}

		setAuthState({ token, user })
	}

	const logout = () => {
		setAuthState(EMPTY_AUTH_STATE)
	}

	return (
		<AuthContext.Provider value={{ ...authState, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
