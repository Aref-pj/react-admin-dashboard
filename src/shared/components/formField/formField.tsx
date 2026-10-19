import { useEffect, useRef } from "react";
import type {
  RegisterOptions,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  textarea?: boolean;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T>;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

// Hold-to-repeat tuning constants.
const HOLD_INITIAL_DELAY = 400; // ms before auto-repeat kicks in
const HOLD_START_INTERVAL = 120; // ms between repeats initially
const HOLD_MIN_INTERVAL = 30; // fastest repeat interval
const HOLD_ACCELERATION = 0.85; // multiply delay each tick → accelerates

export default function FormField<T extends FieldValues>({
  label,
  name,
  type = "text",
  textarea = false,
  register,
  registerOptions,
  error,
  min,
  max,
  step = 1,
}: FormFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const holdTimer = useRef<number | null>(null);
  const holdDelay = useRef<number>(0);

  const { ref: registerRef, ...registerRest } = register(name, registerOptions);

  const isNumber = type === "number";

  const controlClass = `w-full rounded-lg bg-c-background text-sm text-c-text
    focus:ring-2 ${
      error
        ? "border-c-danger focus:border-c-danger focus:ring-c-danger/15"
        : "border-c-border focus:border-c-primary focus:ring-c-primary/15"
    }`;

  function clearHold() {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    holdDelay.current = 0;
  }

  useEffect(() => {
    return () => clearHold();
  }, []);

  function stepValue(direction: 1 | -1) {
    const input = inputRef.current;
    if (!input) return;

    if (direction === 1) input.stepUp();
    else input.stepDown();

    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function startHold(direction: 1 | -1) {
    stepValue(direction);
    inputRef.current?.focus();

    clearHold();
    holdDelay.current = HOLD_START_INTERVAL;

    const startRepeat = () => {
      stepValue(direction);

      holdDelay.current = Math.max(
        HOLD_MIN_INTERVAL,
        holdDelay.current * HOLD_ACCELERATION,
      );

      holdTimer.current = window.setTimeout(startRepeat, holdDelay.current);
    };

    holdTimer.current = window.setTimeout(startRepeat, HOLD_INITIAL_DELAY);
  }

  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text text-c-text-muted font-semibold text-xs">
          {label}
        </span>
      </label>

      {textarea ? (
        <textarea
          id={name}
          rows={4}
          {...registerRest}
          ref={registerRef}
          className={`textarea textarea-bordered ${controlClass} resize-none`}
        />
      ) : isNumber ? (
        <div className="relative">
          <input
            id={name}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            {...registerRest}
            ref={(el) => {
              inputRef.current = el;
              registerRef(el);
            }}
            className={`input input-bordered ${controlClass} pr-11
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none`}
          />

          <div
            className="absolute inset-y-1 right-1 flex w-7 flex-col overflow-hidden
              rounded-md border border-c-border bg-c-surface"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label={`Increase ${label}`}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                startHold(1);
              }}
              onPointerUp={clearHold}
              onPointerLeave={clearHold}
              onPointerCancel={clearHold}
              onContextMenu={(e) => e.preventDefault()}
              className="flex flex-1 items-center justify-center text-c-text-muted
                transition-colors hover:bg-c-surface-hover hover:text-c-text
                active:bg-c-primary/10"
            >
              <LuChevronUp size={14} />
            </button>

            <button
              type="button"
              tabIndex={-1}
              aria-label={`Decrease ${label}`}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                startHold(-1);
              }}
              onPointerUp={clearHold}
              onPointerLeave={clearHold}
              onPointerCancel={clearHold}
              onContextMenu={(e) => e.preventDefault()}
              className="flex flex-1 items-center justify-center border-t border-c-border
                text-c-text-muted transition-colors
                hover:bg-c-surface-hover hover:text-c-text active:bg-c-primary/10"
            >
              <LuChevronDown size={14} />
            </button>
          </div>
        </div>
      ) : (
        <input
          id={name}
          type={type}
          {...registerRest}
          ref={registerRef}
          className={`input input-bordered ${controlClass}`}
        />
      )}

      {error && (
        <span className="mt-1 text-xs text-c-danger">
          {error}
        </span>
      )}
    </div>
  );
}