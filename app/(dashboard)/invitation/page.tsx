"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  X,
  Plus
} from "lucide-react";
import { orgService, Workspace } from "@/services/org.service";

export default function InvitationPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [isInviting, setIsInviting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invitesData, workspacesData] = await Promise.all([
          orgService.getInvitations(),
          orgService.getWorkspaces()
        ]);
        setPendingInvites(invitesData);
        setWorkspaces(workspacesData);
      } catch (error) {
        console.error("Failed to fetch invitation data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInvite = async () => {
    if (!email || workspaces.length === 0) return;
    setIsInviting(true);
    try {
      const activeOrgId = localStorage.getItem("activeOrgId");
      const targetWorkspace = workspaces.find((w: Workspace) => !activeOrgId || w.organization === activeOrgId) || workspaces[0];
      
      const newInvite = await orgService.inviteMember({ 
        email, 
        workspaceId: targetWorkspace.id 
      });
      setPendingInvites([newInvite, ...pendingInvites]);
      setEmail("");
    } catch (error) {
      console.error("Failed to send invitation", error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Inviter des Collaborateurs</h1>
        <p className="mt-1 text-sm text-zinc-500 font-medium">Développez votre équipe en invitant de nouveaux membres à rejoindre votre organisation.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Invite Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-black/5">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl shadow-black/20">
              <UserPlus size={28} />
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="collegue@entreprise.com"
                    className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 pl-12 pr-4 py-4 text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-900 focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-4 block text-xs font-black uppercase tracking-widest text-zinc-400">Rôle de l'utilisateur</label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Admin", "Member", "Viewer"].map((r) => (
                    <button 
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 transition-all ${role === r ? "border-zinc-900 bg-zinc-950 text-white shadow-lg" : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-200"}`}
                    >
                      <ShieldCheck size={18} className={role === r ? "text-zinc-400" : "text-zinc-300"} />
                      <span className="text-xs font-black uppercase tracking-widest">{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleInvite}
                disabled={!email || isInviting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 py-5 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:bg-black active:scale-95 disabled:opacity-50"
              >
                {isInviting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Plus size={20} />
                )}
                ENVOYER L'INVITATION
              </button>
            </div>
          </div>
        </div>

        {/* Pending Invites */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Invitations en attente</h3>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-black text-zinc-500">{pendingInvites.length}</span>
            </div>

            <div className="space-y-4">
              {pendingInvites.map((invite, i) => (
                <div key={i} className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:bg-white hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                      <Clock size={18} className="text-zinc-400" />
                    </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{invite.email}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{invite.workspace_name || "Workspace"}</p>
                  </div>
                  </div>
                  <button className="rounded-lg p-2 text-zinc-300 transition hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-600/20">
            <h4 className="flex items-center gap-2 text-lg font-bold"> Team Collaboration <CheckCircle2 size={20} /></h4>
            <p className="mt-2 text-xs font-medium text-indigo-100 leading-relaxed">Les membres invités recevront un email avec un lien sécurisé pour rejoindre votre organisation AgileFlow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
