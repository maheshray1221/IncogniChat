import { email, z } from "zod";

// agar koi ek filed ki validation check ho to object banane ki koi jarurat nhi hai
export const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 3 characters")
  .max(20, "Username must be no more then 20 characters")
  .regex(/^[a-zA-Z0-9._-]+$/, "Username must not contain special character");

//   yha ek se jyada filed check ho rhi hai issiliy object banega

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
  .string()
  .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 character" })
    .max(20, { message: "Password must be no more then 20 characters" }),
});
