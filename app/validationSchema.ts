import { z } from "zod";

// validate login input
export const loginSchema = z.object({
    email: z.string().nonempty("Email is required!").email('Invalid email address!'),
    password: z.string().nonempty('Password is required!')
});

// validate school registration input
export const schoolSchema = z.object({
    name: z.string().min(1, "School name is required!"),
    description: z.string().optional(),
    email: z.string().email().min(1, 'School email is required!'),
    location: z.string().min(1, 'School location is required!'),
    phone: z.string().min(1, 'School phone number is required!')
})