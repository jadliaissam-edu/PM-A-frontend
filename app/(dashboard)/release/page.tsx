"use client";

import React, { useEffect, useState } from "react";
import { releaseService, Release, ReleaseCreate } from "@/services/release.service";
import { projectService, Project } from "@/services/project.service";
import { dashboardService } from "@/services/dashboard.service";
import {
  Loader2, Plus, X, PackageOpen, ChevronRight,
  Layers, Tag, CheckCircle2, Archive, Clock, Rocket
} from "lucide-react";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  released: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-blue-50 text-blue-700 border-blue-200",
  archived: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  released: <CheckCircle2 size={12} />,
  draft: <Clock size={12} />,
  archived: <Archive size={12} />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReleaseManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReleaseCreate>({
    name: "",
    tag: "",
    description: "",
    status: "draft",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // ── Load projects ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0]);
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    loadProjects();
  }, []);

  // ── Load releases when project is selected ───────────────────────────────────
  useEffect(() => {
    if (!selectedProject) {
      setLoading(false);
      return;
    }
    loadReleases();
  }, [selectedProject]);

  const loadReleases = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const data = await releaseService.getReleases(selectedProject.id);
      setReleases(data);
    } catch (e) {
      console.error("Failed to load releases", e);
      setReleases([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Create release ───────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setFormError(null);
    setIsSubmitting(true);
    try {
      await releaseService.createRelease(selectedProject.id, formData);
      setIsModalOpen(false);
      setFormData({ name: "", tag: "", description: "", status: "draft" });
      await loadReleases();
    } catch (e: any) {
      const detail = e?.response?.data;
      setFormError(
        typeof detail === "string"
          ? detail
          : detail?.detail || detail?.tag?.[0] || "Erreur lors de la création."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Close release ────────────────────────────────────────────────────────────
  const handleClose = async (releaseId: string) => {
    if (!selectedProject) return;
    try {
      await releaseService.closeRelease(selectedProject.id, releaseId);
      await loadReleases();
    } catch (e) {
      console.error("Failed to close release", e);
    }
  };

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filteredReleases =
    activeFilter === "all"
      ? releases
      : releases.filter((r) => r.status === activeFilter);

  const stats = {
    total: releases.length,
    released: releases.filter((r) => r.status === "released").length,
    draft: releases.filter((r) => r.status === "draft").length,
    archived: releases.filter((r) => r.status === "archived").length,
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Gestion des Releases</h1>
          <div className="mt-2 flex items-center gap-2">
            <Layers size={14} className="text-zinc-400" />
            <select
              className="bg-transparent border-none text-sm font-medium text-zinc-600 outline-none cursor-pointer hover:text-zinc-900 transition"
              value={selectedProject?.id || ""}
              onChange={(e) => {
                const p = projects.find((pr) => pr.id === e.target.value);
                if (p) setSelectedProject(p);
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              {projects.length === 0 && <option>Aucun projet</option>}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedProject}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Créer une Release
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-zinc-900" },
          { label: "Publiées", value: stats.released, color: "text-emerald-600" },
          { label: "Brouillons", value: stats.draft, color: "text-blue-600" },
          { label: "Archivées", value: stats.archived, color: "text-zinc-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-zinc-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{s.label}</p>
            <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Release List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {["all", "released", "draft", "archived"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  activeFilter === f
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-200"
                }`}
              >
                {f === "all" ? "Tous" : f}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
          ) : filteredReleases.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20">
              <PackageOpen className="text-zinc-200 mb-4" size={48} />
              <p className="text-sm font-medium text-zinc-500">Aucune release trouvée</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 rounded-xl bg-zinc-900 px-6 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition"
              >
                Créer la première
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReleases.map((release) => (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  onClose={() => handleClose(release.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
            <h2 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-widest">
              Statistiques
            </h2>
            <div className="space-y-4">
              {[
                { label: "Taux de livraison", value: stats.total > 0 ? Math.round((stats.released / stats.total) * 100) : 0 },
                { label: "En cours", value: stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0 },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-zinc-900 font-bold">{value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 transition-all" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 text-white">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <Rocket size={12} className="inline mr-1" />Dernier déploiement
            </p>
            {stats.released > 0 ? (
              <>
                <p className="text-xl font-bold mt-2">
                  {releases.find((r) => r.status === "released")?.name || "—"}
                </p>
                <p className="text-xs text-zinc-400 mt-2">
                  {releases.find((r) => r.status === "released")?.tag || ""}
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-400 mt-2">Aucune release publiée</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-10 shadow-2xl border border-zinc-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-zinc-900">Nouvelle Release</h2>
              <button
                onClick={() => { setIsModalOpen(false); setFormError(null); }}
                className="h-10 w-10 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Nom de la release <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="v2.1.0 – Sprint dashboard"
                  className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-6 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Tag / Version <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    required
                    type="text"
                    placeholder="v2.1.0"
                    className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent pl-10 pr-6 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Notes de version, fonctionnalités incluses..."
                  rows={3}
                  className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-6 py-4 text-sm font-medium text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Statut initial
                </label>
                <select
                  className="w-full rounded-2xl bg-zinc-50 border-2 border-transparent px-6 py-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="draft">Brouillon</option>
                  <option value="released">Publiée</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-zinc-900 py-5 text-sm font-black text-white shadow-xl hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                CRÉER LA RELEASE
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Release Card ─────────────────────────────────────────────────────────────

function ReleaseCard({ release, onClose }: { release: Release; onClose: () => void }) {
  const statusStyle = STATUS_STYLES[release.status] || STATUS_STYLES.draft;
  const statusIcon = STATUS_ICON[release.status] || STATUS_ICON.draft;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-zinc-900">{release.name}</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}>
            {statusIcon}
            {release.status}
          </span>
          <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-lg border border-zinc-100">
            {release.tag}
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          {release.release_date
            ? new Date(release.release_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
            : "Date non définie"}
        </span>
      </div>

      {release.description && (
        <p className="text-sm text-zinc-600 leading-relaxed mb-4">{release.description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600">
            {release.created_by_username?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <span className="text-xs text-zinc-500">Par {release.created_by_username}</span>
        </div>
        <div className="flex items-center gap-2">
          {release.status !== "released" && !release.is_closed && (
            <button
              onClick={onClose}
              className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition"
            >
              Publier
            </button>
          )}
          <button className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1">
            Détails <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
