"use client";

import { useRouter } from "next/navigation";

export default function UserEnterprisePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">
          Choisissez votre mode
        </h1>
        <p className="mb-8 text-sm text-zinc-600">
          Sélectionnez le type d&apos;utilisation qui correspond à vos besoins.
        </p>

        <div className="space-y-4">
          {/* Simple / Personal user */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/simple_group")}
            className="group w-full rounded-xl border-2 border-zinc-200 bg-white px-6 py-5 text-left transition hover:border-zinc-900 hover:shadow-lg"
          >
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg transition group-hover:bg-zinc-900 group-hover:text-white">
                👤
              </span>
              <span className="text-lg font-semibold text-zinc-900">
                Utilisateur simple
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Gérez vos projets personnels sans organisation ni espace de
              travail. Idéal pour un usage individuel.
            </p>
          </button>

          {/* Enterprise user */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/enterprise")}
            className="group w-full rounded-xl border-2 border-zinc-200 bg-white px-6 py-5 text-left transition hover:border-zinc-900 hover:shadow-lg"
          >
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg transition group-hover:bg-zinc-900 group-hover:text-white">
                🏢
              </span>
              <span className="text-lg font-semibold text-zinc-900">
                Entreprise
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Accédez aux organisations, espaces de travail et releases.
              Parfait pour les équipes et la collaboration.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
