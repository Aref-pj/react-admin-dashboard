import type {
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: HTMLInputTypeAttribute;
  register: UseFormRegister<T>;
  error?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  placeholder?: string;
}

export default function FormField<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  error,
  icon,
  trailing,
  placeholder,
}: FormFieldProps<T>) {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text text-xs font-semibold text-c-text-muted">
          {label}
        </span>
      </label>

      <div className="relative">
        {icon && (
          <span
            className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-c-text-muted"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`input input-bordered w-full rounded-lg bg-c-background text-sm text-c-text focus:ring-2 ${
            icon ? "pl-10" : ""
          } ${
            error
              ? "border-c-danger focus:border-c-danger focus:ring-c-danger/15"
              : "border-c-border focus:border-c-primary focus:ring-c-primary/15"
          }`}
        />

        {trailing && (
          <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>

      {error && (
        <span className="mt-1 text-xs text-c-danger">
          {error}
        </span>
      )}
    </div>
  );
}
