"use client";

import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [backendError, setBackendError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSuccessMessage("");
    setBackendError("");

    try {
      await authService.register(data);

      setSuccessMessage("Account created successfully. You can sign in now.");
      reset();
    } catch (error: unknown) {
      console.error("Register error:", error);

      const backendData = axios.isAxiosError(error) ? error.response?.data : undefined;

      const backendMessage =
        backendData?.username?.[0] ??
        backendData?.email?.[0] ??
        backendData?.password?.[0] ??
        backendData?.detail ??
        "Unable to create the account right now.";

      setBackendError(backendMessage);
    }
  };

  return (
    <AuthCard
      title="Create account"
      description="Set up your workspace access and prepare for project delivery."
      footer={
        <p className="text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-slate-950 underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {backendError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {backendError}
        </div>
      )}

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
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-slate-500 focus:bg-white"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
            placeholder="Minimum 8 characters"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
