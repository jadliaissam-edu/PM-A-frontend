"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await authService.requestPasswordReset(data.email);
      alert(response.message || "Reset instructions have been sent.");
    } catch (error) {
      console.error(error);
      alert("Unable to send reset instructions right now.");
    }
  };

  return (
    <AuthCard
      title="Reset password"
      description="Enter your account email and we will send you the reset instructions."
      footer={
        <p className="text-center text-sm text-slate-600">
          Remember your credentials?{" "}
          <Link href="/login" className="font-medium text-slate-950 underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send reset email"}
        </button>
      </form>
    </AuthCard>
  );
}
