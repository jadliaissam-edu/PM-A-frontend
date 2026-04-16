"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authService } from "../../services/auth.service";
import { loginSchema, LoginFormData } from "../../lib/validations";
import { useAuthStore } from "../../store";
import { getApiErrorMessage } from "../../lib/utils";

export default function LoginPage() {
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

  
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      setAuth({ user: null, accessToken: response.access, refreshToken: response.refresh });
      console.log("Login success:", response);
      alert("Connexion réussie.");
    } catch (error) {
      console.error("Login error:", error);
      alert(getApiErrorMessage(error, "Erreur de connexion au backend."));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">Connexion</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              {...register("username")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500"
              placeholder="hassine1"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Mot de passe
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500"
              placeholder="********"
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
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}