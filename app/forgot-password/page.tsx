"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authService } from "../../services/auth.service";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "../../lib/validations";
import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();

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
      console.log("Forgot password response:", response);
      alert(response.message || "Demande de réinitialisation envoyée.");
    } catch (error) {
      console.error(error);
      alert(getApiErrorMessage(error, "Erreur lors de l'envoi."));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">
          Mot de passe oublié
        </h1>
        <p className="mb-6 text-sm text-zinc-600">
          Entrez votre email pour recevoir un code OTP de réinitialisation.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSubmitting ? "Envoi..." : "Envoyer le code"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            <Link href="/login" className="text-zinc-900 underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}