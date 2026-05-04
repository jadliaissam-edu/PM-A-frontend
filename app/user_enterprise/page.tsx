"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store";
import { User, Building2, LogOut, ArrowRight } from "lucide-react";

export default function UserEnterprisePage() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleReturn = () => {
    clearAuth();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
  };

  const handleSelectMode = (path: string) => {
    // Save the preferred mode so we don't bother them with this screen next time they log in
    localStorage.setItem("dashboard_mode", path);
    // We use replace so they don't hit the back button to return to this screen easily
    router.replace(path);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 selection:bg-zinc-900 selection:text-white">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-silver/20 via-zinc-100/10 to-zinc-300/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-silver/40 ring-1 ring-zinc-900/5">
        
        {/* Back / Logout Button */}
        <button
          onClick={handleReturn}
          className="group top-8 left-8 mb-8 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Retour à la connexion</span>
        </button>

        <div className="mb-12">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-5xl">
            Choisissez votre mode.
          </h1>
          <p className="text-base text-zinc-500 md:text-lg">
            Sélectionnez l&apos;environnement de travail qui correspond le mieux à vos objectifs et à votre flux de travail.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Simple / Personal user */}
          <button
            type="button"
            onClick={() => handleSelectMode("/dashboard/simple_group")}
            className="group relative flex h-full flex-col items-start rounded-3xl border border-silver bg-white p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-zinc-900 hover:shadow-xl hover:shadow-black/5"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200 transition-colors duration-300 group-hover:bg-zinc-900 group-hover:ring-zinc-900">
              <User size={24} className="text-zinc-600 transition-colors duration-300 group-hover:text-white" />
            </div>
            
            <h2 className="mb-2 text-xl font-bold text-zinc-900">
              Utilisateur Simple
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Gérez vos projets personnels sans organisation complexe ni espace de
              travail superflu. L&apos;idéal pour un usage individuel ciblé.
            </p>
            
            <div className="mt-auto flex w-full items-center justify-between text-sm font-semibold tracking-wide text-zinc-400 transition-colors duration-300 group-hover:text-zinc-900">
              <span>Continuer</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>

          {/* Enterprise user */}
          <button
            type="button"
            onClick={() => handleSelectMode("/dashboard/enterprise")}
            className="group relative flex h-full flex-col items-start rounded-3xl border border-silver bg-white p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-zinc-900 hover:shadow-xl hover:shadow-black/5"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200 transition-colors duration-300 group-hover:bg-zinc-900 group-hover:ring-zinc-900">
              <Building2 size={24} className="text-zinc-600 transition-colors duration-300 group-hover:text-white" />
            </div>
            
            <h2 className="mb-2 text-xl font-bold text-zinc-900">
              Entreprise
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Accédez aux organisations, espaces de travail collaboratifs et cycles de releases.
              Parfait pour les équipes ambitieuses.
            </p>
            
            <div className="mt-auto flex w-full items-center justify-between text-sm font-semibold tracking-wide text-zinc-400 transition-colors duration-300 group-hover:text-zinc-900">
              <span>Continuer</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
