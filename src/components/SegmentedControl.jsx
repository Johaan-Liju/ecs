/**
 * How the visitor wants their enquiry sent. Built on real radio inputs, so
 * arrow-key navigation and screen-reader grouping come for free; the pill is
 * only styling on top.
 */
export default function SegmentedControl({ name, legend, value, onChange, options }) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="grid grid-cols-3 gap-1 rounded-full border border-concrete-line bg-concrete p-1">
        {options.map((o) => (
          <label key={o.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span className="flex items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-center font-display text-[0.8125rem] font-semibold text-navy/60 transition-colors peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mark sm:text-sm">
              {o.icon}
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
