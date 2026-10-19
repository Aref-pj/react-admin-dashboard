import { Link } from "react-router-dom";
import { LuArrowLeft, LuUserRoundX } from "react-icons/lu"

export default function UserNotFound() {
    return (
        <div className="flex min-h-100 flex-col items-center justify-center gap-3 rounded-2xl
            border border-c-border bg-c-surface p-10 text-center"
        >
            <div className="flex size-14 items-center justify-center rounded-full bg-c-bg">
                <LuUserRoundX size={26} className="text-c-danger" />
            </div>

            <p className="font-medium text-c-text-primary">User not found</p>
            <p className="text-sm text-c-text-muted">
                The user you are looking for doesn't exist or has been removed.
            </p>

            <Link
                to="/users"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-c-primary
                    px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
            >
                <LuArrowLeft size={18} color="white"/>
                <span className="text-white">
                    Back to Users
                </span>
            </Link>
        </div>
    );
}