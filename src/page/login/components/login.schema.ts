import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must be less than 100 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
