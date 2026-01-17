import { z } from "zod";

export const employerSchema = z.object({
  companyName: z.string().min(2, "Company name is too short"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
