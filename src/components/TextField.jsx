/** Labelled input or textarea with an inline error message wired up for screen readers. */
export default function TextField({
  id,
  label,
  error,
  hint,
  as = "input",
  className = "",
  ...rest
}) {
  const Field = as === "textarea" ? "textarea" : "input";
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      <Field
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        className={
          "w-full rounded-xl border bg-concrete px-3.5 py-3 text-navy placeholder:text-navy/35 " +
          (as === "textarea" ? "min-h-28 resize-y " : "") +
          (error ? "border-red-500" : "border-concrete-line")
        }
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy/45">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
