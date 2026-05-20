"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleGitHub = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23licbQOsOc387kpcz';
    const redirect = `${window.location.origin}/oauth/callback/github`;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirect
    )}&scope=user:email`;
    window.location.href = url;
  };

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login({ username: data.username, password: data.password });

      // If backend requires MFA, redirect to the verify page with the email
      if (response?.mfa_required) {
        const emailToUse = response.email || data.username;
        router.push(`/mfa?email=${encodeURIComponent(emailToUse)}`);
        return;
      }

      setAuth({
        user: { username: response.username || "", email: response.email || "" },
        accessToken: response.access || "",
        refreshToken: response.refresh || "",
      });

      if (response.access) localStorage.setItem("accessToken", response.access);
      if (response.refresh) localStorage.setItem("refreshToken", response.refresh);

      router.push("/dashboard/enterprise");
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to sign in with the current credentials.");
    }
  };

  return (
    <AuthCard
      title="Sign in"
      description="Continue to your workspace and pick up where your team left off."
      footer={
        <>
          <p className="text-center text-xs font-semibold text-[#68707d]">
            <Link href="/forgot-password" className="font-black text-[#7b68ee] underline-offset-4 transition hover:text-[#6d56ea] hover:underline focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
              Forgot your password?
            </Link>
          </p>
          <p className="text-center text-xs font-semibold text-[#68707d]">
            No account yet?{" "}
            <Link href="/register" className="font-black text-[#7b68ee] underline-offset-4 transition hover:text-[#6d56ea] hover:underline focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
              Create one
            </Link>
          </p>
        </>
      }
    >
      <div className="space-y-3">
        <div className="mb-2">
          <button type="button" onClick={handleGitHub} className="flex h-9 w-full items-center justify-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#20242a] shadow-sm hover:bg-[#f7f8fb]">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[#20242a]">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            Username
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Required</span>
          </label>
          <input
            type="text"
            {...register("username")}
            aria-invalid={Boolean(errors.username)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fff1f1]"
            placeholder="Enter your username"
          />
          {!errors.username && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Use your username to sign in.</p>}
          {errors.username && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            Password
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Required</span>
          </label>
          <input
            type="password"
            {...register("password")}
            aria-invalid={Boolean(errors.password)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fffafa]"
            placeholder="********"
          />
          {!errors.password && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Opens your AgileFlow workspace.</p>}
          {errors.password && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-8 w-full items-center justify-center rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white shadow-sm transition hover:bg-[#6d56ea] active:translate-y-px active:bg-[#5f4bd8] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] disabled:cursor-not-allowed disabled:bg-[#a69af3] disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
    </AuthCard>
  );

}