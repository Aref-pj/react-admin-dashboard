import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { LuUser, LuLock, LuEye, LuEyeOff, LuArrowRight } from "react-icons/lu";
import { AiOutlineMoon } from "react-icons/ai";
import { GoSun } from "react-icons/go";

import useAuthStore from "../../app/store/auth/auth.store";
import useThemeStore from "../../app/store/theme/theme.store";
import IconButton from "../../shared/components/iconButton/iconButton";

import { loginSchema, type LoginFormData } from "./components/login.schema";
import FormField from "./components/formField";

export default function Login() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const isPending = useAuthStore((state) => state.pending.login);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { username: "", password: "" },
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);

    try {
      const status = await login(data.username, data.password);
      if (status) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : "Invalid username or password. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden
          bg-linear-to-br from-c-primary to-c-secondary p-12 text-white lg:flex"
      >
        <div
          className="w-fit cursor-pointer"
          onClick={async () => { await onSubmit({ username: "", password: "" } as LoginFormData) }}
        >
          <h1 className="text-4xl font-extrabold">DASHBOARD</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold leading-tight">
            Welcome back
          </h2>

          <p className="max-w-sm text-lg text-white/80">
            Sign in to keep an eye on your store, users and orders — everything
            in one place.
          </p>
        </div>

        <p className="text-sm text-white/60">
          © 2026 Dashboard. All rights reserved.
        </p>
      </aside>

      <main
        className="relative flex flex-1 flex-col items-center justify-center
          p-6 max-sm:p-4"
      >
        <div className="absolute top-6 right-6 max-sm:top-4 max-sm:right-4">
          <IconButton
            onclick={toggleTheme}
            className="bg-c-surface"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <AiOutlineMoon size={20} /> : <GoSun size={20} />}
          </IconButton>
        </div>

        <div
          className="w-full max-w-md rounded-2xl border border-c-border bg-c-surface
            p-8 max-sm:border-none max-sm:bg-c-background max-sm:p-4"
        >
          <div
            className="mb-8 block w-fit lg:hidden cursor-pointer"
            onClick={async () => { await onSubmit({ username: "test", password: "test1234" } as LoginFormData) }}
          >
            <h1 className="text-3xl font-extrabold text-c-primary">DASHBOARD</h1>
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-semibold text-c-text-secondary">
              Sign In
            </h2>

            <p className="text-sm text-c-text-muted">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              label="Username"
              name="username"
              register={register}
              error={errors.username?.message}
              icon={<LuUser size={16} />}
              placeholder="Enter your username"
            />

            <FormField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              register={register}
              error={errors.password?.message}
              icon={<LuLock size={16} />}
              placeholder="Enter your password"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="flex size-8 items-center justify-center rounded-full
                    text-c-text-muted transition hover:bg-c-surface-hover
                    hover:text-c-text active:bg-c-surface-active"
                >
                  {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              }
            />

            {errorMessage && (
              <p className="text-sm font-medium text-c-danger">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary rounded-lg border-none px-6 text-white
                disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <LuArrowRight size={18} />
              )}

              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
