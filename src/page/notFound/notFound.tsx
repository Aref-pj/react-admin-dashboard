import { useNavigate } from "react-router-dom";
import { LuArrowLeft, LuLayoutDashboard } from "react-icons/lu";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="flex  w-full max-w-lg flex-col items-center justify-center gap-4 rounded-2xl
          border border-c-border bg-c-surface px-6 py-12 text-center
          max-sm:h-full max-sm:max-w-none max-sm:rounded-none
          max-sm:border-none max-sm:bg-c-background max-sm:px-3"
      >
        <p className="text-7xl font-extrabold text-c-primary max-sm:text-6xl">
          404
        </p>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-c-text-secondary">
            Page Not Found
          </h2>

          <p className="text-sm text-c-text-muted">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5
              rounded-4xl border border-c-border bg-c-surface px-4 py-2
              text-c-text-secondary transition hover:bg-c-surface-hover
              hover:text-c-text active:bg-c-surface-active"
          >
            <LuArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-primary rounded-lg border-none px-6 text-white"
          >
            <LuLayoutDashboard size={18} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}