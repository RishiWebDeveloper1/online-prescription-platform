import { useState } from 'react'

function FormInput({ label, name, type = 'text', value, onChange, required, min, step, placeholder, disabled, showPasswordToggle = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPasswordToggle ? (showPassword ? 'text' : 'password') : type

  const onTogglePassword = () => {
    setShowPassword((current) => !current)
  }

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {isPasswordField && showPasswordToggle ? (
        <div className="field__control-wrap">
          <input
            className="field__control"
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            required={required}
            min={min}
            step={step}
            placeholder={placeholder}
            disabled={disabled}
          />
          <button type="button" className="password-toggle" onClick={onTogglePassword}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      ) : (
        <input
          className="field__control"
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </label>
  )
}

export default FormInput
