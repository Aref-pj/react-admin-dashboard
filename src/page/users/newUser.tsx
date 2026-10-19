import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuArrowLeft, LuUserRoundPlus } from "react-icons/lu";

import {
  newUserSchema,
  ROLES,
  STATUSES,
  type NewUserFormData,
} from "./components/newUser.schema";
import AvatarPicker from "./components/avatarPicker";
import FormField from "../../shared/components/formField/formField";
import Select from "../../shared/components/select/select";
import { createUser } from "../users/api";

export default function NewUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      nationalId: "",
      country: "",
      state: "",
      postal: "",
      residentialAddress: "",
      avatar: "",
      role: "User",
      status: "active",
    },
  });

  const name = useWatch({
    control,
    name: "name",
  }) ?? "";

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      navigate("/users");
    },
  });

  const onSubmit = (data: NewUserFormData) => {
    mutate(data);
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/users"
          className="inline-flex shrink-0 cursor-pointer items-center
            justify-center gap-1.5 rounded-4xl border border-c-border
            bg-c-surface px-3 py-2 text-c-text-secondary transition
            hover:bg-c-surface-hover hover:text-c-text
            active:bg-c-surface-active"
        >
          <LuArrowLeft size={16} />
          <span>Back</span>
        </Link>

        <h2 className="text-2xl font-semibold text-c-text-secondary">
          Add New User
        </h2>
      </div>

      {/* Form Card */}
      <div
        className="w-full rounded-2xl border border-c-border
          bg-c-surface sm:p-3 max-sm:px-2"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {/* Avatar */}
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <AvatarPicker
                avatar={field.value}
                name={name}
                onChange={field.onChange}
              />
            )}
          />

          {/* Fields */}
          <div
            className="grid grid-cols-2 gap-x-5 gap-y-4
              max-sm:grid-cols-1"
          >
            <FormField
              label="Full Name"
              name="name"
              register={register}
              error={errors.name?.message}
            />

            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  label="Role"
                  id="role"
                  options={ROLES}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
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
              type="email"
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

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  label="Status"
                  id="status"
                  options={STATUSES}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
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

          {/* API Error */}
          {isError && (
            <p className="text-sm font-medium text-c-danger">
              {error instanceof Error
                ? error.message
                : "Failed to create user. Please try again."}
            </p>
          )}

          {/* Actions */}
          <div
            className="mt-2 flex justify-end gap-3 border-t
              border-c-border pt-5"
          >
            <button
              type="button"
              onClick={() => navigate("/users")}
              disabled={isPending}
              className="btn btn-ghost rounded-lg border-2
                border-c-danger font-bold text-c-danger
                hover:bg-c-danger hover:text-white
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary rounded-lg border-none
                px-6 text-white disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <LuUserRoundPlus size={18} />
              )}

              Create User
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
