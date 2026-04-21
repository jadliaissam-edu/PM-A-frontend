"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authService } from "../../services/auth.service";
import { registerSchema, RegisterFormData } from "../../lib/validations";

export default function RegisterPage() {
  const router = useRouter();
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
      setSuccessMessage("Compte créé avec succès. Redirection vers la connexion...");
      reset();
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      console.error("Register error:", error);
      console.error("Backend response:", error?.response?.data);

      const backendData = error?.response?.data;

      const backendMessage =
        backendData?.username?.[0] ||
        backendData?.email?.[0] ||
        backendData?.password?.[0] ||
        backendData?.detail ||
        "Erreur lors de l'inscription.";

      setBackendError(backendMessage);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-premium border border-silver ring-1 ring-black/5">
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 tracking-tight">Inscription</h1>

        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {backendError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {backendError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              {...register("username")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none 
                 text-zinc-900 placeholder:text-zinc-400 
                 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none 
                 text-zinc-900 placeholder:text-zinc-400 
                 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              placeholder="exemple@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Mot de passe
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none 
             bg-white text-zinc-900 placeholder:text-zinc-400 caret-zinc-900
             focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              placeholder="********"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSubmitting ? "Inscription..." : "S’inscrire"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-zinc-900 underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}