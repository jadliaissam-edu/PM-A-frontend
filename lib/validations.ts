import { z } from "zod";
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
export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est obligatoire")
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Veuillez entrer un email valide"),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});



