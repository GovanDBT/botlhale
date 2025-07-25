import { z } from "zod";

// validate login input
export const loginSchema = z.object({
    email: z.string().nonempty("Email is required!").email('Invalid email address!'),
    password: z.string().nonempty('Password is required!')
});

// validate school registration input
export const schoolSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "School name is required!"),
    description: z.string().optional(),
    email: z.string().email().min(1, 'School email is required!'),
    location: z.string().min(1, 'School location is required!'),
    phone: z.string().min(1, 'School phone number is required!'),
});

// validate admin registration input
export const adminSchema = z.object({
    firstname: z.string().min(1, "Firstname is required!"),
    lastname: z.string().min(1, "lastname is required!"),
    school_id: z.number().min(1, "School is required!"),
    email: z.string().email().min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required!")
})