import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print"
import useAuthStore from "../../app/store/auth/auth.store";
import IconButton from "../../shared/components/iconButton/iconButton";
import EditProfileModal from "./components/editProfileModal";

import { LuPrinter, LuPencil, LuInstagram } from "react-icons/lu";
import { LiaLinkedinIn } from "react-icons/lia";
import { RxGithubLogo } from "react-icons/rx";

interface InfoItemProps {
    label: string;
    value?: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="min-w-0">
            <p className="text-xs max-sm:text-base mb-2 font-bold text-c-text-muted">
                {label}
            </p>
            <p className="text-sm max-sm:text-lg wrap-break-word">
                {value || "-"}
            </p>
        </div>
    );
}

export default function Profile() {
    const user = useAuthStore((store) => store.user);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const printRef = useRef<HTMLDivElement>(null);
    const printHandler = useReactToPrint({
        contentRef: printRef,
    });

    return (
        <>
            <div
                ref={printRef}
                className="print-box bg-c-surface max-sm:bg-c-background w-full p-3 border border-c-border 
                rounded-2xl max-sm:rounded-none max-sm:border-none flex flex-col gap-4"
            >
                <div className="flex items-center justify-between gap-4 mb-1 px-2 pt-2">
                    <h2 className="font-semibold text-2xl max-sm:text-xl text-c-text-secondary">
                        Profile
                    </h2>

                    <div className="flex shrink-0 justify-center gap-3 items-center">
                        <IconButton
                            onclick={printHandler}
                            className="no-print size-10 bg-c-surface">
                            <LuPrinter size={18} />
                        </IconButton>

                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="no-print cursor-pointer text-c-text-secondary hover:text-c-text hover:bg-c-surface-hover
                             active:bg-c-surface-active transition bg-c-surface flex items-center justify-center gap-1.5 
                             border border-c-border rounded-4xl px-3 py-2"
                        >
                            <LuPencil size={16} />
                            <span>Edit</span>
                        </button>
                    </div>
                </div>

                <div className="bg-c-surface w-full border border-c-border rounded-2xl px-5 py-4 max-sm:justify-center
                 flex items-center justify-between gap-6 max-sm:px-6 max-sm:py-5 max-sm:flex-col max-sm:items-center">
                    <div className="flex items-center max-sm:flex-col gap-5 min-w-0">
                        <img
                            src={user?.avatar || "/images/default-avatar.png"}
                            alt={user?.name || "User"}
                            className="size-19 max-sm:size-22 shrink-0 rounded-full object-cover ring-2 ring-c-border"
                        />
                        <div className="min-w-0">
                            <p className="text-xl max-sm:text-2xl font-bold truncate">
                                {user?.name || "-"}
                            </p>
                            <p className="text-md text-c-text-muted truncate max-sm:hidden">
                                {user?.role || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:justify-center max-sm:items-center">
                        <a href="#" tabIndex={-1} target="_blank"
                            rel="noopener noreferrer" className="rounded-full">
                            <IconButton className="size-12"><LiaLinkedinIn size={25} /></IconButton>
                        </a>
                        <a href="#" tabIndex={-1} target="_blank"
                            rel="noopener noreferrer" className="rounded-full">
                            <IconButton className="size-12"><LuInstagram size={25} /></IconButton>
                        </a>
                        <a href="#" tabIndex={-1} target="_blank"
                            rel="noopener noreferrer" className="rounded-full">
                            <IconButton className="size-12"><RxGithubLogo size={25} /></IconButton>
                        </a>
                    </div>
                </div>

                <div className="bg-c-surface w-full border border-c-border rounded-2xl px-6 py-5 max-sm:px-4">
                    <h3 className="text-c-text-secondary text-lg font-semibold mb-6">Personal Information</h3>
                    <div className="px-3 grid grid-cols-2 gap-x-6 gap-y-6 max-sm:grid-cols-1">
                        <InfoItem label="Full Name" value={user?.name} />
                        <InfoItem label="Role" value={user?.role} />
                        <InfoItem label="Phone" value={user?.phone} />
                        <InfoItem label="Email" value={user?.email} />
                        <InfoItem label="National ID" value={user?.nationalId} />
                    </div>
                </div>

                <div className="bg-c-surface w-full border border-c-border rounded-2xl px-6 py-5 max-sm:px-4">
                    <h3 className="text-c-text-secondary text-lg font-semibold mb-6">Address</h3>
                    <div className="px-3 grid grid-cols-2 gap-x-6 gap-y-6 max-sm:grid-cols-1">
                        <InfoItem label="Country" value={user?.country} />
                        <InfoItem label="State / City" value={user?.state} />
                        <InfoItem label="Residential Address" value={user?.residentialAddress} />
                        <InfoItem label="Postal Code" value={user?.postal} />
                    </div>
                </div>
            </div>

            {isEditModalOpen &&
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
            }
        </>
    );
}