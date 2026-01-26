import {z} from "zod"

// in production email called identifier
export const signInSchema = z.object({
    identifier:z.string(),
    password:z.string()
})