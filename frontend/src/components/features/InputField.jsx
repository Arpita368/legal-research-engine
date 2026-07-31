"use client";

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label ? <span>{label}</span> : null}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="glass-input h-10 rounded-lg px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-teal-600/50 dark:placeholder:text-zinc-600 dark:focus:border-teal-200/40"
      />
    </label>
  );
}
