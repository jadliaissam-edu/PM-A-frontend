"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { CheckCircle2, KeyRound, Palette, ShieldAlert, UserCircle, UserPlus } from "lucide-react";
import { Chip, GhostButton, Panel, PrimaryButton, WorkspaceHeader, WorkspacePage } from "@/components/workspace-ui";
import { useAuthStore } from "../../../store";
import { api } from "@/lib/api";

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [securityMenu, setSecurityMenu] = useState<"password" | "mfa" | null>(null);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
  });

  
  useEffect(() => {
    try {
      const storedAccent = localStorage.getItem("af:accent");
      const storedDensity = localStorage.getItem("af:density");
      if (storedAccent) setAccent(storedAccent);
      if (storedDensity) setDensity(storedDensity);
    } catch (e) {
      // ignore
    }
  }, []);

  // Apply accent and density to document and persist
  useEffect(() => {
    try {
      // compute a subtle hover variant (lighten by 12%)
      const hex = accent.replace("#", "");
      const toRgb = (h: string) => ({
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
      });
      const rgb = toRgb(hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex);
      const lighten = (v: number, pct = 0.12) => Math.round(v + (255 - v) * pct);
      const hover = `#${[lighten(rgb.r), lighten(rgb.g), lighten(rgb.b)].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
      document.documentElement.style.setProperty("--primary-color", accent);
      document.documentElement.style.setProperty("--primary-color-hover", hover);
      localStorage.setItem("af:accent", accent);
    } catch (e) {
      // ignore
    }
  }, [accent]);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-density", density.toLowerCase());
      localStorage.setItem("af:density", density);
    } catch (e) {
      // ignore
    }
  }, [density]);

  // When the auth store user is populated from the server, populate the profile form
  useEffect(() => {
    if (!user) return;
    setProfileForm({
      firstName: (user as any).first_name || (user as any).firstName || "",
      lastName: (user as any).last_name || (user as any).lastName || "",
      email: user.email || "",
    });
    const pickAvatar = (u: any) => u?.avatar_url || u?.avatarUrl || u?.avatar || u?.profile_image || u?.image || u?.picture || null;
    setAvatarPreview(pickAvatar(user));
  }, [user]);

  // Debug: log profile form changes to help trace why edits may not persist
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.debug("profileForm changed:", profileForm, "avatarFile:", avatarFile);
    } catch (e) {}
  }, [profileForm, avatarFile]);

  // Handle avatar file selection and upload immediately
  const handleAvatarSelected = async (file: File | null) => {
    setAvatarFile(file);
    if (!file) return;
    const prevPreview = avatarPreview;
    const tempUrl = URL.createObjectURL(file);
    setAvatarPreview(tempUrl);
    setIsSaving(true);
    try {
      // try common backend field names if unknown
      const candidateNames = ["avatar", "avatar_file", "file"];
      let resp: any = null;
      for (const name of candidateNames) {
        const form = new FormData();
        form.append(name, file);
        try {
          resp = await api.patch("/users/me/", form);
          // break on successful status
          if (resp && resp.status >= 200 && resp.status < 300) break;
        } catch (err) {
          // try next candidate
          resp = null;
        }
      }

      // After upload attempt, fetch the authoritative profile from server
      const profileResp = await api.get("/users/me/");
      const userData = profileResp.data?.user ?? profileResp.data;
      // eslint-disable-next-line no-console
      console.debug("Profile after avatar upload:", profileResp?.status, userData);
      const pickAvatar = (u: any) => u?.avatar_url || u?.avatarUrl || u?.avatar || u?.profile_image || u?.image || u?.picture || null;
      const got = pickAvatar(userData);
      if (userData && got) {
        setAvatarPreview(got);
        try { useAuthStore.getState().setAuth({ user: userData, accessToken: localStorage.getItem("accessToken") ?? undefined, refreshToken: localStorage.getItem("refreshToken") ?? undefined }); } catch (e) {}
        setNotice("Avatar uploaded successfully.");
      } else if (userData) {
        // no avatar url found in response; update store and notify user
        try { useAuthStore.getState().setAuth({ user: userData, accessToken: localStorage.getItem("accessToken") ?? undefined, refreshToken: localStorage.getItem("refreshToken") ?? undefined }); } catch (e) {}
        setNotice("Upload completed but server returned no avatar URL. Backend may store avatar separately.");
      } else {
        setNotice("Upload completed but no profile returned from server.");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Avatar upload failed:", e);
      setNotice("Failed to upload avatar.");
      // revert preview to previous if available
      setAvatarPreview(prevPreview);
    } finally {
      setIsSaving(false);
      setAvatarFile(null);
      // release temporary object URL
      try { URL.revokeObjectURL(tempUrl); } catch (e) {}
    }
  };

  // Display name computed from user or local form as a fallback
  const displayName = (() => {
    const fn = (user as any)?.first_name || (user as any)?.firstName || profileForm.firstName;
    const ln = (user as any)?.last_name || (user as any)?.lastName || profileForm.lastName;
    const name = [fn, ln].filter(Boolean).join(" ");
    return name || user?.username || "";
  })();

  return (
    <WorkspacePage>
      <WorkspaceHeader
        title="Settings"
        subtitle="Everything / profile / workspace preferences"
        avatarUrl={avatarPreview || (user as any)?.avatar_url}
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
            { id: "security", label: "Security", icon: <ShieldAlert size={15} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`mb-1 flex h-9 w-full items-center gap-2 rounded-[7px] px-2 text-left text-xs font-black ${tab === item.id ? "bg-[#f3efff] text-[var(--primary-color)]" : "text-[#68707d] hover:bg-[#f7f8fb]"}`}>
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
                  <div className="mx-auto mb-3 relative h-24 w-24 rounded-full ring-4 ring-[#f3efff]">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary-color)] text-3xl font-black text-white">{user?.username?.charAt(0).toUpperCase() || ""}</div>
                    )}
                    <div className="absolute -right-2 -bottom-2">
                      <input ref={fileInputRef} accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        void handleAvatarSelected(file);
                      }} type="file" className="hidden" />
                      <button type="button" onClick={() => (fileInputRef?.current as HTMLInputElement | null)?.click()} className="h-8 w-8 rounded-full bg-white shadow-sm text-sm">✎</button>
                    </div>
                  </div>
                  <h2 className="text-lg font-black text-[#20242a]">{displayName}</h2>
                  <p className="text-sm font-semibold text-[#7c828d]">{user?.email || ""}</p>
            </div>
              </Panel>
              <Panel title="Personal information">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-black uppercase text-[#8f96a3]">First name<input value={profileForm.firstName} onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#20242a] outline-none focus:border-[var(--primary-color)]" /></label>
                  <label className="text-xs font-black uppercase text-[#8f96a3]">Last name<input value={profileForm.lastName} onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#20242a] outline-none focus:border-[var(--primary-color)]" /></label>
                  <label className="md:col-span-2 text-xs font-black uppercase text-[#8f96a3]">Email<input value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} className="mt-1 h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#20242a] outline-none focus:border-[var(--primary-color)]" /></label>
                </div>
                <div className="mt-4 flex justify-end">
                    <PrimaryButton disabled={isSaving} onClick={async () => {
                      setIsSaving(true);
                      try {
                        // Debug: show what's being sent
                        // eslint-disable-next-line no-console
                        console.debug("Saving profile, payload:", profileForm, "avatarFile:", avatarFile);

                        if (avatarFile) {
                          const form = new FormData();
                          form.append("avatar", avatarFile);
                          form.append("first_name", profileForm.firstName);
                          form.append("last_name", profileForm.lastName);
                          form.append("email", profileForm.email);
                          const derivedUsername = `${(profileForm.firstName || "").toString().trim()}_${(profileForm.lastName || "").toString().trim()}`.replace(/\s+/g, "_");
                          form.append("username", derivedUsername);
                          // Let axios set the Content-Type (boundary) automatically
                          const resp = await api.patch("/users/me/", form);
                          // Debug: log server response
                          // eslint-disable-next-line no-console
                          console.debug("Save response (with avatar):", resp?.status, resp?.data);
                          const userData = resp.data?.user ?? resp.data;
                          // ensure username present locally
                          if (userData && !userData.username) userData.username = derivedUsername;
                          try { useAuthStore.getState().setAuth({ user: userData, accessToken: localStorage.getItem("accessToken") ?? undefined, refreshToken: localStorage.getItem("refreshToken") ?? undefined }); } catch (e) {}
                          setProfileForm({ firstName: userData.first_name || userData.firstName || "", lastName: userData.last_name || userData.lastName || "", email: userData.email || "" });
                          if (userData?.avatar_url) setAvatarPreview(userData.avatar_url);
                          setAvatarFile(null);
                          setNotice("Profile updated successfully.");
                        } else {
                          const derivedUsername = `${(profileForm.firstName || "").toString().trim()}_${(profileForm.lastName || "").toString().trim()}`.replace(/\s+/g, "_");
                          const resp = await api.patch("/users/me/", { first_name: profileForm.firstName, last_name: profileForm.lastName, email: profileForm.email, username: derivedUsername });
                          // Debug: log server response
                          // eslint-disable-next-line no-console
                          console.debug("Save response (no avatar):", resp?.status, resp?.data);
                          const userData = resp.data?.user ?? resp.data;
                          if (userData && !userData.username) userData.username = derivedUsername;
                          try { useAuthStore.getState().setAuth({ user: userData, accessToken: localStorage.getItem("accessToken") ?? undefined, refreshToken: localStorage.getItem("refreshToken") ?? undefined }); } catch (e) {}
                          setProfileForm({ firstName: userData.first_name || userData.firstName || "", lastName: userData.last_name || userData.lastName || "", email: userData.email || "" });
                          setNotice("Profile updated successfully.");
                        }
                      } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error("Profile save failed:", e);
                        setNotice("Failed to update profile.");
                      } finally {
                        setIsSaving(false);
                      }
                    }}>{isSaving ? "Saving..." : "Save changes"}</PrimaryButton>
                  </div>
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
              <p>color</p>
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
                    <input type="checkbox" checked={preferences[item as keyof typeof preferences]} onChange={() => { setPreferences((current) => ({ ...current, [item]: !current[item as keyof typeof preferences] })); setNotice("Preference updated locally."); }} className="h-4 w-4 accent-[var(--primary-color)]" />
                  </label>
                ))}
              </div>
            </Panel>
          )}

          {/* Notifications tab removed per request */}

          {tab === "security" && (
            <Panel title="Security">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3">
                  <div className="mb-2 flex items-center gap-2"><KeyRound size={15} className="text-[var(--primary-color)]" /><p className="text-sm font-black text-[#20242a]">Password</p></div>
                  <p className="text-xs font-semibold text-[#7c828d]">Last updated 3 months ago.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => setSecurityMenu("password")} className="h-7 rounded-[7px] border border-[#dfe3e8] bg-white px-2 text-xs font-black text-[#68707d] hover:bg-[#f7f8fb]">Review</button>
                    <Link href="/forgot-password" className="inline-flex h-7 items-center rounded-[7px] bg-[var(--primary-color)] px-2 text-xs font-black text-white">Reset password</Link>
                  </div>
                </div>
                <div role="button" tabIndex={0} onClick={() => setSecurityMenu("mfa")} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSecurityMenu("mfa"); } }} className="rounded-[8px] border border-[#edf0f3] bg-[#f7f8fb] p-3 text-left hover:bg-white cursor-pointer">
                  <div className="mb-2 flex items-center gap-2"><ShieldAlert size={15} className="text-[var(--primary-color)]" /><p className="text-sm font-black text-[#20242a]">MFA</p></div>
                  <p className="text-xs font-semibold text-[#7c828d]">Enabled for this account.</p>
                  <div className="mt-3">
                    <Chip tone="green">Protected</Chip>
                    <div className="mt-3 flex gap-2">
                      <Link href="/mfa/setup" className="inline-flex h-8 items-center rounded-[7px] bg-[var(--primary-color)] px-3 text-xs font-black text-white">Set up MFA</Link>
                      <Link href="/mfa/verify" className="inline-flex h-8 items-center rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#68707d]">Verify code</Link>
                      <button onClick={() => setSecurityMenu("mfa")} className="inline-flex h-8 items-center rounded-[7px] bg-[#f7f8fb] px-3 text-xs font-black text-[#68707d]">Manage</button>
                    </div>
                  </div>
                  </div>
              </div>
            </Panel>
          )}
        </section>
      </div>
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setInviteOpen(false)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#20242a]">Invite teammate</h2>
              <button onClick={() => setInviteOpen(false)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button>
            </div>
            <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && inviteEmail.trim()) { setInviteOpen(false); setNotice(`Invite staged for ${inviteEmail.trim()}.`); setInviteEmail(""); } }} placeholder="Email address" className="h-10 w-full rounded-[8px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-sm font-semibold outline-none focus:border-[var(--primary-color)]" />
            <div className="mt-3 flex justify-end"><PrimaryButton onClick={() => { if (!inviteEmail.trim()) return; setInviteOpen(false); setNotice(`Invite staged for ${inviteEmail.trim()}.`); setInviteEmail(""); }}>Invite</PrimaryButton></div>
          </section>
        </div>
      )}
      {securityMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20242a]/35 px-4 backdrop-blur-sm" onMouseDown={() => setSecurityMenu(null)}>
          <section onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[12px] border border-[#dfe3e8] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-black text-[#20242a]">{securityMenu === "password" ? "Password security" : "Multi-factor authentication"}</h2><button onClick={() => setSecurityMenu(null)} className="h-7 w-7 rounded-[7px] bg-[#f7f8fb] text-sm font-black text-[#68707d]">x</button></div>
            <p className="text-sm font-semibold leading-6 text-[#68707d]">{securityMenu === "password" ? "Password reset is available through the existing reset flow." : "MFA controls are displayed locally. Backend persistence is not added in this pass."}</p>
            {securityMenu === "password" && <Link href="/forgot-password" className="mt-3 flex h-9 items-center justify-center rounded-[8px] bg-[var(--primary-color)] text-sm font-black text-white">Open reset flow</Link>}
          </section>
        </div>
      )}
    </WorkspacePage>
  );
}
