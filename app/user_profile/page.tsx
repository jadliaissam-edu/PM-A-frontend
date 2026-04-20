"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../../store";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const handleBack = () => {
        // In a real app, we might check if they came from enterprise or simple
        router.back();
    };

    return (
        <main className="min-h-screen bg-zinc-100 py-12 px-4">
            <div className="mx-auto max-w-3xl">
                {/* Breadcrumb / Back button */}
                <button
                    onClick={handleBack}
                    className="mb-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition"
                >
                    <span>←</span> Retour
                </button>

                <h1 className="mb-8 text-3xl font-bold text-zinc-900">Mon Profil</h1>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Left Column: Avatar & Summary */}
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-white p-6 shadow-md text-center">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 text-3xl font-bold text-white shadow-lg">
                                {user?.username?.charAt(0).toUpperCase() ?? "U"}
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900">
                                {user?.username ?? "Utilisateur"}
                            </h2>
                            <p className="text-sm text-zinc-500">{user?.email ?? "email@exemple.com"}</p>
                            <button className="mt-6 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
                                Modifier la photo
                            </button>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-md">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">
                                Statut du compte
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-600">Type</span>
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-900">
                                        Premium
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-600">Membre depuis</span>
                                    <span className="text-sm font-medium text-zinc-900">Avril 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="rounded-2xl bg-white p-8 shadow-md">
                            <h3 className="mb-6 text-lg font-bold text-zinc-900">Informations personnelles</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-zinc-700">Prénom</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.first_name || ""}
                                            className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500 transition"
                                            placeholder="Jean"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-zinc-700">Nom</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.last_name || ""}
                                            className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500 transition"
                                            placeholder="Dupont"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || ""}
                                        className="w-full rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-500 transition"
                                        placeholder="exemple@email.com"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
                                    >
                                        Sauvegarder les modifications
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Section */}
                        <div className="rounded-2xl bg-white p-8 shadow-md">
                            <h3 className="mb-6 text-lg font-bold text-zinc-900">Sécurité</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                    <div>
                                        <p className="font-semibold text-zinc-900">Mot de passe</p>
                                        <p className="text-sm text-zinc-500">Dernière modification il y a 3 mois</p>
                                    </div>
                                    <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50">
                                        Changer
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-zinc-900">Double authentification (MFA)</p>
                                        <p className="text-sm text-zinc-500 text-green-600 font-medium">Activé</p>
                                    </div>
                                    <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 text-red-600">
                                        Désactiver
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="rounded-2xl bg-white p-8 shadow-md">
                            <h3 className="mb-6 text-lg font-bold text-zinc-900">Préférences</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-zinc-700">Notifications par email</span>
                                    <div className="relative">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                                    </div>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-zinc-700">Rapports hebdomadaires</span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
