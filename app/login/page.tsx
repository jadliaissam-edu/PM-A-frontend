"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginFormData } from "../../lib/validations";
import { useAuthStore } from "../../store";
import { loginAction } from "@/app/actions/auth";
import { getApiErrorMessage } from "../../lib/utils";

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
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginAction(data);

      if (!result.success || !result.user) {
        alert(result.error || "Erreur de connexion.");
        return;
      }

      // Only store non-sensitive user data in Zustand
      setAuth({
        user: result.user
      });

      alert("Connexion réussie.");
      
      const preferredMode = localStorage.getItem("dashboard_mode");
      if (preferredMode) {
        router.push(preferredMode);
      } else {
        router.push("/user_enterprise");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(getApiErrorMessage(error, "Erreur de connexion au backend."));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-premium border border-silver ring-1 ring-black/5">
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 tracking-tight">Connexion</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none 
           bg-white text-zinc-900 placeholder:text-zinc-400 caret-zinc-900
           focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"              placeholder="votre@email.com"
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
             focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"              placeholder="********"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            <Link href="/forgot-password" className="text-zinc-900 underline">
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="text-center text-sm text-zinc-600">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-zinc-900 underline">
              S’inscrire
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}