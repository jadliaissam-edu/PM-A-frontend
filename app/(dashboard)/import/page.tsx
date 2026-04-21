"use client";

import React, { useState } from "react";

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Importation de données</h1>
          <p className="text-sm text-zinc-500">Importez vos tickets, membres ou projets depuis des fichiers CSV, JSON ou Jira.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Dropzone */}
          <div className="lg:col-span-2 space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition ${
                dragActive ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl text-white mb-6">
                📁
              </div>
              <h2 className="text-lg font-bold text-zinc-900">
                {file ? file.name : "Glissez-déposez votre fichier ici"}
              </h2>
              <p className="mt-2 text-sm text-zinc-500 text-center max-w-xs">
                Supports CSV, JSON, XML ou exports Jira (.zip). Taille max 25Mo.
              </p>
              <button className="mt-8 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition shadow-lg shadow-zinc-900/20">
                Parcourir les fichiers
              </button>
            </div>

            {/* Steps / Info */}
            <div className="rounded-2xl bg-white p-6 border border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900 mb-4 tracking-widest uppercase">Processus d&apos;import</h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Téléchargement", desc: "Uploadez votre fichier source." },
                  { step: 2, title: "Mapping des champs", desc: "Associez vos colonnes aux champs système." },
                  { step: 3, title: "Validation", desc: "Vérifiez les données avant l'importation finale." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-900 shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{s.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Help & Presets */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-zinc-900 p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Aide à l&apos;import</h3>
                <p className="text-lg font-bold mt-2">Modèles disponibles</p>
                <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                  Téléchargez nos fichiers modèles pour structurer vos données correctement dès le départ.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                   <button className="w-full text-left bg-white/10 p-3 rounded-lg text-xs font-medium hover:bg-white/20 transition">
                     CSV Modèle Tickets.csv
                   </button>
                   <button className="w-full text-left bg-white/10 p-3 rounded-lg text-xs font-medium hover:bg-white/20 transition">
                     JSON Schema Members.json
                   </button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-zinc-200">
               <h3 className="text-sm font-bold text-zinc-900 mb-4 tracking-widest uppercase text-xs">Intégrations directes</h3>
               <div className="space-y-3">
                 {['Jira', 'Trello', 'Asana', 'GitHub Issues'].map(app => (
                   <div key={app} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-900 transition cursor-pointer">
                     <span className="text-sm font-medium text-zinc-700">{app}</span>
                     <span className="text-xs text-zinc-400">→</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
