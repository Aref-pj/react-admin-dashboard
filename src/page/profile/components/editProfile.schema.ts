import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .regex(
      /^[\p{L}\p{M}\s'-]+$/u,
      "Name can only contain letters, spaces"
    ),

  phone: z
    .string()
    .trim()
    .refine(
      (value) => isValidPhoneNumber(value),
      "Enter a valid phone number"
    ),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  nationalId: z
    .string()
    .trim()
    .regex(
      /^\d{10}$/,
      "National ID must contain exactly 10 digits"
    ),

  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .regex(
      /^[\p{L}\p{M}\s'-]+$/u,
      "Country can only contain letters, spaces"
    ),

  state: z
    .string()
    .trim()
    .min(2, "State / City must be at least 2 characters"),

  postal: z
    .string()
    .trim()
    .regex(
      /^[0-9]+(?:-[0-9]+)*$/,
      "Postal code can only contain numbers and hyphens"
    ),

  residentialAddress: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;