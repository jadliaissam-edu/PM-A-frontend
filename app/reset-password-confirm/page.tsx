"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authService } from "../../services/auth.service";
import { resetConfirmSchema, ResetConfirmFormData } from "../../lib/validations";
import { Suspense } from "react";

function ResetPasswordConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const otpFromQuery = searchParams.get("otp") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetConfirmFormData>({
    resolver: zodResolver(resetConfirmSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: otpFromQuery,
      new_password: "",
    },
  });

  const onSubmit = async (data: ResetConfirmFormData) => {
    try {
      const response = await authService.confirmPasswordReset(data);
      alert(response.message ?? "Mot de passe reinitialise.");
      router.push("/login");
    } catch (error) {
      console.error("Confirm reset error:", error);
      alert("Erreur lors de la reinitialisation du mot de passe.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">Nouveau mot de passe</h1>
        <p className="mb-6 text-sm text-zinc-600">
          Confirmez l&apos;email, le code OTP, puis choisissez un nouveau mot de passe.
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

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nouveau mot de passe</label>
            <input
              type="password"
              {...register("new_password")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500"
              placeholder="********"
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-500">{errors.new_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSubmitting ? "Validation..." : "Reinitialiser le mot de passe"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            <Link href="/login" className="text-zinc-900 underline">
              Retour a la connexion
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordConfirmForm />
    </Suspense>
  );
}
