import {z} from "zod"

// in production email called identifier
export const acceptMessagesSchema = z.object({
    acceptMessages:z.boolean(),
   
})