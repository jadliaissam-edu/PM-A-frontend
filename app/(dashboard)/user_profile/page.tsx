"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, CheckCircle2, KeyRound, Palette, ShieldAlert, SlidersHorizontal, UserCircle, UserPlus } from "lucide-react";
import { Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { useAuthStore } from "../../../store";

export default function SettingsHubPage() {
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });
  const [density, setDensity] = useState("Standard");
  const [accent, setAccent] = useState("#7b68ee");
  const [notice, setNotice] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({
    "Task assigned": true,
    "Mentioned in comment": true,
    "Release shipped": true,
  });
  const [securityMenu, setSecurityMenu] = useState<"password" | "mfa" | null>(null);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    "Auto-close parent tasks": true,
    "Private projects by default": false,
    "Show subtasks in list views": true,
  });

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Settings"
        subtitle="Everything / profile / workspace preferences"
        badge="Personal"
        actions={<><GhostButton onClick={() => {
          void navigator.clipboard?.writeText(window.location.href);
          setNotice("Profile link copied locally.");
        }}>Copy profile link</GhostButton><PrimaryButton onClick={() => setInviteOpen(true)}><span className="inline-flex items-center gap-1"><UserPlus size={14} /> Invite</span></PrimaryButton></>}
      />

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[10px] border border-[#dfe3e8] bg-white p-2.5 shadow-sm">
          {[
            { id: "profile", label: "Profile", icon: <UserCircle size={15} /> },
            { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
            { id: "preferences", label: "Preferences", icon: <SlidersHorizontal size={15} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`mb-1 flex h-9 w-full items-center gap-2 rounded-[7px] px-2 text-left text-xs font-black ${tab === item.id ? "bg-[#f3efff] text-[#7b68ee]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        <section className="space-y-4">
          {notice && <button onClick={() => setNotice("")} className="w-full rounded-[8px] border border-[#d7f4e8] bg-[#ecfff6] px-3 py-2 text-left text-xs font-black text-[#008f65]">{notice}</button>}
          {tab === "profile" && (
            <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
              <Panel title="Account summary">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-[#7b68ee] text-3xl font-black text-white ring-4 ring-[#f3efff]">{user?.username?.charAt(0).toUpperCase() || "A"}</div>
                  <h2 className="text-lg font-black text-[#20242a]">{user?.username || "Aya Achiban"}</h2>
                  <p className="text-sm font-semibold text-[#7c828d]">{user?.email || "aya.achiban@agileflow.com"}</p>
                  <div className="mt-4 flex justify-center gap-2"><Chip tone="purple">Premium</Chip><Chip tone="green">MFA enabled</Chip></div>
                </div>
              </Panel>
              <Panel title="Personal information">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-black uppercase text-[#8f96a3]">First name<input value={profileForm.firstName} onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#20242a] outline-none focus:border-[#7b68ee]" /></label>
                  <label className="text-xs font-black uppercase text-[#8f96a3]">Last name<input value={profileForm.lastName} onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#20242a] outline-none focus:border-[#7b68ee]" /></label>
                  <label className="md:col-span-2 text-xs font-black uppercase text-[#8f96a3]">Email<input value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#20242a] outline-none focus:border-[#7b68ee]" /></label>
                </div>
                <div className="mt-4 flex justify-end gap-2"><GhostButton onClick={() => setProfileForm({ firstName: user?.first_name || "", lastName: user?.last_name || "", email: user?.email || "" })}>Reset</GhostButton><PrimaryButton onClick={() => setNotice("Profile changes saved locally.")}>Save changes</PrimaryButton></div>
              </Panel>
            </div>
          )}

          {tab === "appearance" && (
            <Panel title="Appearance">
              <div className="grid gap-3 md:grid-cols-3">
                {["Compact", "Standard", "Comfortable"].map((item) => (
                  <button key={item} onClick={() => { setDensity(item); setNotice(`${item} density selected locally.`); }} className={`rounded-[9px] border p-4 text-left ${density === item ? "border-[#d7d1ff] bg-[#f3efff]" : "border-[#dfe3e8] bg-[#f7f8fb] hover:bg-white"}`}>
                    <p className="text-sm font-black text-[#20242a]">{item}</p>
                    <p className="mt-1 text-xs font-semibold text-[#7c828d]">Workspace density preset</p>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                {["#7b68ee", "#1090e0", "#00b884", "#f8ae00", "#e5484d"].map((color) => (
                  <button key={color} onClick={() => { setAccent(color); setNotice("Accent color updated locally."); }} className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: color }}>
                    {accent === color && <CheckCircle2 size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </Panel>
          )}

          {tab === "preferences" && (
            <Panel title="Project preferences">
              <div className="space-y-3">
                {Object.keys(preferences).map((item) => (
                  <label key={item} className="flex items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                    <span className="text-sm font-black text-[#20242a]">{item}</span>
                    <input type="checkbox" checked={preferences[item]} onChange={() => { setPreferences((current) => ({ ...current, [item]: !current[item] })); setNotice("Preference updated locally."); }} className="h-4 w-4 accent-[#7b68ee]" />
                  </label>
                ))}
              </div>
            </Panel>
          )}

          {tab === "notifications" && (
            <Panel title="Notifications">
              <div className="space-y-3">
                {Object.keys(notificationSettings).map((item) => (
                  <button key={item} onClick={() => { setNotificationSettings((current) => ({ ...current, [item]: !current[item] })); setNotice("Notification preference updated locally."); }} className="flex w-full items-center justify-between rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white">
                    <span className="text-sm font-black text-[#20242a]">{item}</span>
                    <Chip tone={notificationSettings[item] ? "green" : "neutral"}>{notificationSettings[item] ? "Enabled" : "Muted"}</Chip>
                  </button>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Security">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                <div className="mb-2 flex items-center gap-2"><KeyRound size={15} className="text-[#7b68ee]" /><p className="text-sm font-black text-[#20242a]">Password</p></div>
                <p className="text-xs font-semibold text-[#7c828d]">Last updated 3 months ago.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => setSecurityMenu("password")} className="h-7 rounded-[7px] border border-[#dfe3e8] bg-white px-2 text-xs font-black text-[#68707d] hover:bg-[#f7f8fb]">Review</button>
                  <Link href="/forgot-password" className="inline-flex h-7 items-center rounded-[7px] bg-[#7b68ee] px-2 text-xs font-black text-white">Reset password</Link>
                </div>
              </div>
              <button onClick={() => setSecurityMenu("mfa")} className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white">
                <div className="mb-2 flex items-center gap-2"><ShieldAlert size={15} className="text-[#00b884]" /><p className="text-sm font-black text-[#20242a]">MFA</p></div>
                <p className="text-xs font-semibold text-[#7c828d]">Enabled for this account.</p>
                <div className="mt-3"><Chip tone="green">Protected</Chip></div>
              </button>
            </div>
          </Panel>
        </section>
      </div>
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setInviteOpen(false)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">Invite teammate</h2>
              <button onClick={() => setInviteOpen(false)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && inviteEmail.trim()) { setInviteOpen(false); setNotice(`Invite staged for ${inviteEmail.trim()}.`); setInviteEmail(""); } }} placeholder="Email address" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[#7b68ee]" />
            <div className="mt-3 flex justify-end"><PrimaryButton onClick={() => { if (!inviteEmail.trim()) return; setInviteOpen(false); setNotice(`Invite staged for ${inviteEmail.trim()}.`); setInviteEmail(""); }}>Invite</PrimaryButton></div>
          </section>
        </div>
      )}
      {securityMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setSecurityMenu(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-black text-[#20242a]">{securityMenu === "password" ? "Password security" : "Multi-factor authentication"}</h2><button onClick={() => setSecurityMenu(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button></div>
            <p className="text-sm font-semibold leading-6 text-[#68707d]">{securityMenu === "password" ? "Password reset is available through the existing reset flow." : "MFA controls are displayed locally. Backend persistence is not added in this pass."}</p>
            {securityMenu === "password" && <Link href="/forgot-password" className="mt-3 flex h-9 items-center justify-center rounded-[8px] bg-[#7b68ee] text-sm font-black text-white">Open reset flow</Link>}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
