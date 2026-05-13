"use client";

import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [backendError, setBackendError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSuccessMessage("");
    setBackendError("");

    try {
      // map our form fields to backend expected payload (snake_case)
      const username = data.username || (data.email ? data.email.split("@")[0] : undefined);

      await authService.register({
        username: username as string,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      setSuccessMessage("Account created successfully. You can sign in now.");
      reset();
    } catch (error: unknown) {
      console.error("Register error:", error);

      const backendData = axios.isAxiosError(error) ? error.response?.data : undefined;

      const backendMessage =
        backendData?.username?.[0] ??
        backendData?.email?.[0] ??
        backendData?.password?.[0] ??
        backendData?.detail ??
        "Unable to create the account right now.";

      setBackendError(backendMessage);
    }
  };

  return (
    <AuthCard
      title="Create account"
      description="Set up your workspace access and prepare for project delivery."
      footer={
        <p className="text-center text-xs font-semibold text-[#68707d]">
          Already registered?{" "}
          <Link href="/login" className="font-black text-[#7b68ee] underline-offset-4 transition hover:text-[#6d56ea] hover:underline focus:outline-none focus:ring-2 focus:ring-[#d7d1ff]">
            Back to sign in
          </Link>
        </p>
      }
    >
      {successMessage && (
        <div className="mb-3 rounded-[4px] border border-[#d7f4e8] bg-[#ecfff6] px-2 py-1.5 text-[10px] font-black text-[#008f65]">
          {successMessage}
        </div>
      )}

      {backendError && (
        <div className="mb-3 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1.5 text-[10px] font-black text-[#e5484d]">
          {backendError}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <button type="button" onClick={() => signIn('google')} className="flex h-9 w-full items-center justify-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#20242a] shadow-sm hover:bg-[#f7f8fb]">Continue with Google</button>
          <button type="button" onClick={() => signIn('github')} className="flex h-9 w-full items-center justify-center gap-2 rounded-[7px] border border-[#dfe3e8] bg-white px-3 text-xs font-black text-[#20242a] shadow-sm hover:bg-[#f7f8fb]">Continue with GitHub</button>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex-1 border-t border-[#edf0f3]" />
          <span className="text-[11px] font-black text-[#8f96a3]">or continue with email</span>
          <span className="flex-1 border-t border-[#edf0f3]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            First name
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Required</span>
          </label>
          <input
            type="text"
            {...register("firstName")}
            aria-invalid={Boolean(errors.firstName)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fffafa]"
            placeholder="First name"
          />
          {!errors.firstName && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Shown on your profile.</p>}
          {errors.firstName && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            Last name
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Required</span>
          </label>
          <input
            type="text"
            {...register("lastName")}
            aria-invalid={Boolean(errors.lastName)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fffafa]"
            placeholder="Last name"
          />
          {!errors.lastName && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Shown on your profile.</p>}
          {errors.lastName && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            Username
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Optional</span>
          </label>
          <input
            type="text"
            {...register("username")}
            aria-invalid={Boolean(errors.username)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fffafa]"
            placeholder="Choose a username (optional)"
          />
          {!errors.username && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Used for mentions and profile URL.</p>}
          {errors.username && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-[10px] font-black uppercase text-[#8f96a3]">
            Email
            <span className="normal-case text-[10px] font-bold text-[#a2a9b5]">Required</span>
          </label>
          <input
            type="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            className="h-9 w-full rounded-[7px] border border-[#dfe3e8] bg-[#f7f8fb] px-3 text-xs font-black text-[#20242a] outline-none transition placeholder:text-[#9aa1ad] hover:bg-white focus:border-[#7b68ee] focus:bg-white focus:ring-2 focus:ring-[#d7d1ff] aria-[invalid=true]:border-[#ffd6d6] aria-[invalid=true]:bg-[#fffafa]"
            placeholder="you@example.com"
          />
          {!errors.email && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Use your team email.</p>}
          {errors.email && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.email.message}</p>
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
            placeholder="Minimum 8 characters"
          />
          {!errors.password && <p className="mt-1 text-[10px] font-bold text-[#8f96a3]">Minimum 8 characters.</p>}
          {errors.password && (
            <p className="mt-1 rounded-[4px] border border-[#ffd6d6] bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-[#e5484d]">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-8 w-full items-center justify-center rounded-[7px] bg-[#7b68ee] px-3.5 text-xs font-black text-white shadow-sm transition hover:bg-[#6d56ea] active:translate-y-px active:bg-[#5f4bd8] focus:outline-none focus:ring-2 focus:ring-[#d7d1ff] disabled:cursor-not-allowed disabled:bg-[#a69af3] disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      </div>
    </AuthCard>
  );
}
