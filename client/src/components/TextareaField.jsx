function TextareaField({ label, name, value, onChange, required, placeholder, rows = 5, disabled }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea
        className="field__control field__control--textarea"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
    </label>
  )
}

export default TextareaField
