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
        <p className="text-center text-xs font-semibold text-[#68707d]">
          Remember your credentials?{" "}
          <Link href="/login" className="font-black text-[#7b68ee] underline-offset-4 transition hover:text-[#6d56ea] hover:underline focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            Email
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Required</span>
          </label>
          <input
            type="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fffafa]"
            placeholder="you@example.com"
          />
          {!errors.email && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">We will send reset instructions here.</p>}
          {errors.email && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-8 w-full items-center justify-center rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white shadow-sm transition hover:bg-[#6d56ea] active:translate-y-px active:bg-[#5f4bd8] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] disabled:cursor-not-allowed disabled:bg-[#a69af3] disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send reset email"}
        </button>
      </form>
    </AuthCard>
  );
}
