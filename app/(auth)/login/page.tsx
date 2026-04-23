"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);

      setAuth({
        user: { username: data.username },
        accessToken: response.access,
        refreshToken: response.refresh,
      });

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to sign in with the current credentials.");
    }
  };

  return (
    <AuthCard
      title="Sign in"
      description="Continue to your workspace and pick up where your team left off."
      footer={
        <>
          <p className="text-center text-sm text-slate-600">
            <Link href="/forgot-password" className="font-medium text-slate-950 underline">
              Forgot your password?
            </Link>
          </p>
          <p className="text-center text-sm text-slate-600">
            No account yet?{" "}
            <Link href="/register" className="font-medium text-slate-950 underline">
              Create one
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-slate-500 focus:bg-white"
            placeholder="team.member"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-slate-500 focus:bg-white"
            placeholder="********"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}
