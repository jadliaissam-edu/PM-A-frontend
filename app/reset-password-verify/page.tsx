"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authService } from "../../services/auth.service";
import { verifyOtpSchema, VerifyOtpFormData } from "../../lib/validations";
import { Suspense } from "react";

function ResetPasswordVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      await authService.verifyResetOtp(data);
      alert("OTP verifie.");
      router.push(
        `/reset-password-confirm?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(data.otp)}`
      );
    } catch (error) {
      console.error("Verify OTP error:", error);
      alert("OTP invalide ou expire.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">Verification OTP</h1>
        <p className="mb-6 text-sm text-zinc-600">
          Entrez l&apos;email et le code OTP recu pour continuer.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500"
              placeholder="exemple@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Code OTP</label>
            <input
              type="text"
              {...register("otp")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 tracking-[0.2em] outline-none focus:border-zinc-500"
              placeholder="123456"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSubmitting ? "Verification..." : "Verifier le code"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            <Link href="/forgot-password" className="text-zinc-900 underline">
              Retour a l&apos;envoi OTP
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordVerifyForm />
    </Suspense>
  );
}
