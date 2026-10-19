import { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

interface SelectProps<T extends string> {
  label: string;
  id: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: string;
  format?: (value: T) => string;
  preserveCase?: boolean;
}

export default function Select<T extends string>({
  label,
  id,
  options,
  value,
  onChange,
  onBlur,
  error,
  format = (value) => value,
  preserveCase = false,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onBlur]);

  const handleOptionSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div className="form-control">
      <label
        htmlFor={id}
        className="label"
      >
        <span className="label-text text-xs font-semibold text-c-text-muted">
          {label}
        </span>
      </label>

      <div
        ref={dropdownRef}
        className="dropdown relative w-full"
      >
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`input input-bordered flex w-full items-center
            justify-between rounded-lg border-c-border bg-c-background
            text-sm font-normal text-c-text transition 
            ${isOpen
              ? "border-c-primary ring-2 ring-c-primary/15"
              : ""
            }
            ${error
              ? "border-c-danger ring-2 ring-c-danger/15"
              : ""
            }`}
        >
          <span className={`${preserveCase ? "" : "capitalize"} overflow-hidden text-ellipsis`}>
            {format(value)}
          </span>

          <LuChevronDown
            size={18}
            className={`text-c-text-muted transition-transform
              duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            aria-labelledby={id}
            className="absolute top-[120%] z-50 mt-1 w-full
              max-h-60 overflow-y-auto overflow-x-hidden
              rounded-lg border border-c-border bg-c-background p-1
              shadow-lg divide-y divide-c-border"
          >
            {options.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={value === option}
              >
                <button
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full border-c-border px-3 py-2  hover:bg-c-primary hover:text-white
                    text-left text-sm transition-colors ${preserveCase ? "" : "capitalize"
                    } ${value === option
                      ? "bg-c-primary/20 text-c-primary"
                      : "text-c-text bg-c-surface r"
                    }`}
                >
                  {format(option)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs font-medium text-c-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}