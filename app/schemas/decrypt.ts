import z from "zod"

const decryptSchema = z.object({
    file: z.instanceof(File, { message: "File is required" }),
    secretKey: z.string().optional()
})

type DecryptType = z.infer<typeof decryptSchema>

export { decryptSchema, type DecryptType }
