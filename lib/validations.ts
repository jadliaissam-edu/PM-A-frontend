import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Veuillez entrer un email valide"),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est obligatoire"),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Veuillez entrer un email valide"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Veuillez entrer un email valide"),
  otp: z
    .string()
    .min(6, "Le code OTP doit contenir 6 chiffres")
    .max(6, "Le code OTP doit contenir 6 chiffres"),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const resetConfirmSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Veuillez entrer un email valide"),
  otp: z
    .string()
    .min(6, "Le code OTP doit contenir 6 chiffres")
    .max(6, "Le code OTP doit contenir 6 chiffres"),
  new_password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type ResetConfirmFormData = z.infer<typeof resetConfirmSchema>;