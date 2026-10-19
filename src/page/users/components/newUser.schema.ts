import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const ROLES = [
  "Admin",
  "Manager",
  "Editor",
  "Seller",
  "User",
] as const;

export const STATUSES = [
  "active",
  "inactive",
] as const;

const personNameRegex = /^[\p{L}\p{M}\s'-]+$/u;

const locationNameRegex = /^[\p{L}\p{M}\s'-]+$/u;

export const newUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      personNameRegex,
      "Can only contain letters, spaces, hyphens, and apostrophes"
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
    .email("Enter a valid email address")
    .max(150, "Email must be less than 150 characters"),

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
    .max(100, "Country must be less than 100 characters")
    .regex(
      locationNameRegex,
      "Can only contain letters and spaces"
    ),

  state: z
    .string()
    .trim()
    .min(2, "State / City must be at least 2 characters")
    .max(100, "State / City must be less than 100 characters")
    .regex(
      locationNameRegex,
      "Can only contain letters and spaces"
    ),

  postal: z
    .string()
    .trim()
    .min(3, "Postal code is too short")
    .max(20, "Postal code is too long")
    .regex(
      /^[0-9]+(?:-[0-9]+)*$/,
      "Postal code can only contain numbers and hyphens"
    ),

  residentialAddress: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(
      200,
      "Address must be less than 200 characters"
    ),

  role: z.enum(ROLES),

  status: z.enum(STATUSES),

  avatar: z.string(),
});

export type NewUserFormData = z.infer<typeof newUserSchema>;
