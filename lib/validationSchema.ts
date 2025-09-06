import { z } from "zod";

// Enumerations
export const school_levels = ["Senior School", "Junior School", "Primary School"] as const;
export const school_type = ["Public", "Private"] as const;

// validate email input
export const loginSchema = z.object({
    email: z.string().email("Invalid email address!").optional(),
    password: z.string().optional(),
    forcePasswordChange: z.boolean().optional(), // Make it optional
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.forcePasswordChange === false) {
        if (!data.password) {
        ctx.addIssue({
          code: "custom",
          message: "Password is required",
          path: ["password"],
        });
      }
      if (!data.email) {
        ctx.addIssue({
          code: "custom",
          message: "Email is required",
          path: ["email"],
        });
      }
    }
    if (data.forcePasswordChange) {
      if (!data.newPassword) {
        ctx.addIssue({
          code: "custom",
          message: "New password is required",
          path: ["newPassword"],
        });
      }
      if ((data.newPassword ?? "").length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "Password should be 8 characters long",
          path: ["newPassword"],
        });
      }
      if (!data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Confirm password is required",
          path: ["confirmPassword"],
        });
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    }
  });

// validate school registration input
export const schoolSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "School name is required!"),
    level: z.enum(school_levels, {errorMap: () => ({ message: 'School level is required!'})}),
    type: z.enum(school_type, {errorMap: () => ({ message: 'School type is required!'})}),
    description: z.string().optional(),
    email: z.string().email().min(1, 'School email is required!'),
    location: z.string().min(1, 'School location is required!'),
    phone: z.string().min(1, 'School phone number is required!'),
});

// validate school admin registration input
export const schoolAdminSchema = z.object({
    id: z.string().optional(),
    firstname: z.string().min(1, "Firstname is required!"),
    lastname: z.string().min(1, "lastname is required!"),
    school: z.number().min(1, "School is required!"),
    email: z.string().email().min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required!")
})

// validate school admin registration input
export const updateSchoolAdminSchema = z.object({
    firstname: z.string().min(1, "Firstname is required!"),
    lastname: z.string().min(1, "lastname is required!"),
    school: z.number().min(1, "School is required!"),
    email: z.string().email().optional(),
    phone: z.string().optional()
})

// validate reset password input
export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });