import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Le username est obligatoire"),
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