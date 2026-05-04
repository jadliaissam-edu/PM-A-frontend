"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../../../store";
import { useRouter } from "next/navigation";
import { 
    UploadCloud, 
    Share2, 
    UserPlus, 
    KeyRound,
    ShieldAlert,
    Camera,
    Sparkles,
    Loader2,
    UserCircle,
    Palette,
    SlidersHorizontal,
    Bell,
    CheckCircle2
} from "lucide-react";

export default function SettingsHubPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");

    const handleBack = () => {
        router.back();
    };

    const tabs = [
        { id: "profile", label: "Mon Profil", icon: <UserCircle size={18} /> },
        { id: "appearance", label: "Apparence & Thème", icon: <Palette size={18} /> },
        { id: "preferences", label: "Préférences Projet", icon: <SlidersHorizontal size={18} /> },
        { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    ];

    return (
        <main className="min-h-screen bg-zinc-100 py-10 px-4 relative">
            <div className="mx-auto max-w-6xl">
                {/* Breadcrumb / Back button */}
                <button
                    onClick={handleBack}
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition"
                >
                    <span>←</span> Retour au tableau de bord
                </button>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-zinc-900">Paramètres</h1>
                    <p className="mt-2 text-sm text-zinc-500">Gérez vos préférences de compte, l'apparence de l'application et les paramètres de vos projets.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Settings Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex flex-col space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? "bg-zinc-900 text-white shadow-sm"
                                            : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Settings Content Area */}
                    <div className="flex-1 min-w-0">
                        {activeTab === "profile" && <ProfileTab />}
                        {activeTab === "appearance" && <AppearanceTab />}
                        {activeTab === "preferences" && <ProjectPreferencesTab />}
                        {activeTab === "notifications" && (
                            <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-200 text-center">
                                <Bell size={48} className="mx-auto text-zinc-300 mb-4" />
                                <h3 className="text-lg font-bold text-zinc-900">Notifications</h3>
                                <p className="text-zinc-500 mt-2">Paramètres de notification en cours de construction.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

function AppearanceTab() {
    const colors = [
        { name: "Zinc (Défaut)", hex: "bg-zinc-900", active: true },
        { name: "Indigo", hex: "bg-indigo-600", active: false },
        { name: "Emerald", hex: "bg-emerald-600", active: false },
        { name: "Rose", hex: "bg-rose-600", active: false },
        { name: "Amber", hex: "bg-amber-500", active: false },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-200">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">Thème et Couleurs</h3>
                
                <div className="mb-8">
                    <h4 className="text-sm font-semibold text-zinc-700 mb-4">Mode d'affichage</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button className="border-2 border-zinc-900 rounded-xl p-4 flex flex-col items-center gap-3 bg-zinc-50 transition">
                            <div className="w-16 h-12 bg-white rounded-md border border-zinc-200 shadow-sm flex items-center justify-center">
                                <div className="w-8 h-2 bg-zinc-200 rounded-full"></div>
                            </div>
                            <span className="text-sm font-bold text-zinc-900">Clair</span>
                        </button>
                        <button className="border-2 border-transparent rounded-xl p-4 flex flex-col items-center gap-3 bg-zinc-50 hover:bg-zinc-100 transition">
                            <div className="w-16 h-12 bg-zinc-900 rounded-md border border-zinc-800 shadow-sm flex items-center justify-center">
                                <div className="w-8 h-2 bg-zinc-700 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-zinc-600">Sombre</span>
                        </button>
                        <button className="border-2 border-transparent rounded-xl p-4 flex flex-col items-center gap-3 bg-zinc-50 hover:bg-zinc-100 transition">
                            <div className="w-16 h-12 bg-gradient-to-r from-white to-zinc-900 rounded-md border border-zinc-200 shadow-sm flex items-center justify-center"></div>
                            <span className="text-sm font-medium text-zinc-600">Système</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-zinc-700 mb-4">Couleur d'accentuation</h4>
                    <div className="flex flex-wrap gap-4">
                        {colors.map((color) => (
                            <button key={color.name} className="flex flex-col items-center gap-2 group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${color.hex} ${color.active ? 'ring-2 ring-offset-2 ring-zinc-900' : ''}`}>
                                    {color.active && <CheckCircle2 size={16} className="text-white" />}
                                </div>
                                <span className="text-[10px] font-medium text-zinc-500 uppercase">{color.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-zinc-100">
                    <h4 className="text-sm font-semibold text-zinc-700 mb-4">Densité de l'interface</h4>
                    <div className="flex bg-zinc-100 p-1 rounded-lg w-fit">
                        <button className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900">Compacte</button>
                        <button className="px-4 py-1.5 rounded-md bg-white text-sm font-bold text-zinc-900 shadow-sm">Standard</button>
                        <button className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900">Spacieuse</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectPreferencesTab() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-200">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">Paramètres Globaux des Projets</h3>
                
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-700">Durée par défaut d'un Sprint</label>
                            <select className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white transition">
                                <option>1 Semaine</option>
                                <option>2 Semaines (Recommandé)</option>
                                <option>3 Semaines</option>
                                <option>4 Semaines</option>
                            </select>
                            <p className="mt-1.5 text-xs text-zinc-500">Ceci s'appliquera aux nouveaux sprints créés.</p>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-700">Estimation par défaut</label>
                            <select className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white transition">
                                <option>Story Points (Fibonacci)</option>
                                <option>Heures (Time-tracking)</option>
                                <option>T-Shirt Sizing (S, M, L, XL)</option>
                            </select>
                            <p className="mt-1.5 text-xs text-zinc-500">Métrique utilisée pour mesurer l'effort des tickets.</p>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-6">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-zinc-300 rounded peer-checked:bg-zinc-900 peer-checked:border-zinc-900 transition flex items-center justify-center">
                                    <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-zinc-900">Fermeture auto des tickets</span>
                                <p className="text-xs text-zinc-500 mt-1">Marquer automatiquement les parents "Terminés" lorsque toutes les sous-tâches sont achevées.</p>
                            </div>
                        </label>
                    </div>

                    <div className="border-t border-zinc-100 pt-6">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-zinc-300 rounded peer-checked:bg-zinc-900 peer-checked:border-zinc-900 transition flex items-center justify-center">
                                    <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-zinc-900">Restrictions de visibilité (Enterprise)</span>
                                <p className="text-xs text-zinc-500 mt-1">Forcer les nouveaux projets à être privés par défaut au sein de l'organisation.</p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="button" className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition shadow-sm">
                            Enregistrer les préférences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ProfileTab() {
    const user = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAvatarClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setAvatarUrl(objectUrl);
        }
    };

    const handleGenerateAI = () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        const timestamp = new Date().getTime();
        const generatedUrl = `https://source.unsplash.com/random/400x400/?${encodeURIComponent(aiPrompt)}&v=${timestamp}`;
        
        const img = new Image();
        img.src = generatedUrl;
        img.onload = () => {
            setAvatarUrl(generatedUrl);
            setIsGenerating(false);
            setIsAIPromptOpen(false);
            setAiPrompt("");
        };
        img.onerror = () => {
            const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(aiPrompt + timestamp)}/400/400`;
            setAvatarUrl(fallbackUrl);
            setIsGenerating(false);
            setIsAIPromptOpen(false);
            setAiPrompt("");
        };
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in relative">
            {isAIPromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm transform transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900">Générer avec l'IA</h3>
                        </div>
                        <p className="text-sm text-zinc-500 mb-5">
                            Décrivez l'image ou l'avatar que vous souhaitez générer via Unsplash.
                        </p>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition mb-5"
                            placeholder="ex: Portrait cyberpunk au néon..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                            autoFocus
                        />
                        <div className="flex items-center justify-end gap-3 mt-2">
                            <button 
                                onClick={() => setIsAIPromptOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="flex flex-1 justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isGenerating ? (
                                    <><Loader2 size={16} className="animate-spin" /> Création...</>
                                ) : (
                                    <><Sparkles size={16} /> Générer</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-white border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition shadow-sm">
                        <Share2 size={16} />
                        Copier le lien du profil
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition shadow-sm">
                        <UserPlus size={16} />
                        Inviter un collaborateur
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Avatar & Summary */}
                <div className="space-y-6">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-200 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-zinc-800 to-zinc-600"></div>
                        
                        <div 
                            className="relative mx-auto mt-6 mb-4 flex h-28 w-28 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-4xl font-bold text-white shadow-xl ring-4 ring-white group transition-transform hover:scale-105 overflow-hidden"
                            onClick={handleAvatarClick}
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.username?.charAt(0).toUpperCase() ?? "U"}</span>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                <Camera size={28} className="text-white" />
                            </div>
                        </div>
                        
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        
                        <h2 className="text-xl font-bold text-zinc-900 mt-2">
                            {user?.username ?? "Utilisateur"}
                        </h2>
                        <p className="text-sm font-medium text-zinc-500 mt-1">{user?.email ?? "email@exemple.com"}</p>
                        
                        <div className="mt-6 flex flex-col gap-2">
                            <button 
                                onClick={handleAvatarClick}
                                className="w-full flex justify-center items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition shadow-sm"
                            >
                                <UploadCloud size={16} />
                                Changer photo
                            </button>
                            <button 
                                onClick={() => setIsAIPromptOpen(true)}
                                className="w-full flex justify-center items-center gap-2 rounded-xl border border-transparent bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
                            >
                                <Sparkles size={16} />
                                Générer avec l'IA
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-200">
                        <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                            Statut du compte
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-600">Type</span>
                                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-zinc-900 ring-1 ring-inset ring-zinc-200">
                                    Premium
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-600">Membre depuis</span>
                                <span className="text-sm font-semibold text-zinc-900">Avril 2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-200">
                        <h3 className="mb-6 text-lg font-bold tracking-tight text-zinc-900">Informations personnelles</h3>
                        <form className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Prénom</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.first_name || ""}
                                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white transition"
                                        placeholder="Jean"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Nom</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.last_name || ""}
                                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white transition"
                                        placeholder="Dupont"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:bg-white transition"
                                    placeholder="exemple@email.com"
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition shadow-sm"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-200">
                        <h3 className="mb-6 text-lg font-bold tracking-tight text-zinc-900">Sécurité et Accès</h3>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-5 gap-4">
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                                        <KeyRound size={18} className="text-zinc-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900">Mot de passe</p>
                                        <p className="text-sm text-zinc-500">Dernière modification il y a 3 mois</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link 
                                        href="/forgot-password"
                                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition underline-offset-4 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                    <button className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 shadow-sm">
                                        Changer
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                                        <ShieldAlert size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900">Double authentification (MFA)</p>
                                        <p className="text-sm font-medium text-green-600">Activé pour ce compte</p>
                                    </div>
                                </div>
                                <button className="rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition">
                                    Désactiver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
