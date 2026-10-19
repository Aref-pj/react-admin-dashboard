import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuX } from "react-icons/lu";

import FormField from "../../../shared/components/formField/formField";
import Select from "../../../shared/components/select/select";

import {
  editProfileSchema,
  type EditProfileFormData,
} from "./editProfile.schema";

import useAuthStore, {
  type UserType,
} from "../../../app/store/auth/auth.store";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roles = ["Admin", "Manager", "Editor", "Seller", "User"] as const;

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const user = useAuthStore((store) => store.user);
  const setUser = useAuthStore((store) => store.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      nationalId: user?.nationalId ?? "",
      country: user?.country ?? "",
      state: user?.state ?? "",
      postal: user?.postal ?? "",
      residentialAddress: user?.residentialAddress ?? "",
    },
    mode: "onBlur",
  });

  const [selectedRole, setSelectedRole] = useState<string>(
    user?.role || "User",
  );

  if (!isOpen || !user) return null;

  const onSubmit = (data: EditProfileFormData) => {
    const updatedUser: UserType = {
      ...user,
      ...data,
      role: selectedRole,
    };

    setUser(updatedUser);
    onClose();
  };

  return (
    <dialog open className="modal">
      <div
        className="modal-box w-11/12 max-w-3xl rounded-2xl border border-c-border bg-c-surface p-6 max-sm:w-full max-sm:rounded-none max-sm:p-3"
      >
        <div className="mb-5 flex items-center justify-between border-b border-c-border pb-4">
          <h3 className="text-xl font-bold text-c-text-secondary">
            Edit Profile
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-c-text-muted transition-colors duration-150 hover:bg-c-danger hover:text-white focus:outline-none"
          >
            <LuX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-sm:grid-cols-1">
            <FormField
              label="Full Name"
              name="name"
              register={register}
              error={errors.name?.message}
            />

            <Select
              label="Role"
              id="role"
              options={roles}
              value={
                roles.find((role) => role === selectedRole) ??
                "User"
              }
              onChange={setSelectedRole}
              preserveCase
            />

            <FormField
              label="Phone Number"
              name="phone"
              register={register}
              error={errors.phone?.message}
            />

            <FormField
              label="Email"
              name="email"
              register={register}
              error={errors.email?.message}
            />

            <FormField
              label="National ID"
              name="nationalId"
              register={register}
              error={errors.nationalId?.message}
            />

            <FormField
              label="Country"
              name="country"
              register={register}
              error={errors.country?.message}
            />

            <FormField
              label="State / City"
              name="state"
              register={register}
              error={errors.state?.message}
            />

            <FormField
              label="Postal Code"
              name="postal"
              register={register}
              error={errors.postal?.message}
            />

            <div className="col-span-2 max-sm:col-span-1">
              <FormField
                label="Residential Address"
                name="residentialAddress"
                register={register}
                error={errors.residentialAddress?.message}
              />
            </div>
          </div>

          <div className="modal-action mt-2 border-t border-c-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost rounded-lg border-2 border-c-danger font-bold text-c-danger hover:bg-c-danger hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary rounded-lg border-none px-6 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
}
