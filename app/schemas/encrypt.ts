import z from "zod";

const encryptSchema = z.object({
    file: z.instanceof(File, { message: "File is required" }),
    message: z.string().min(1, { message: "Message is required" }),
    secretKey: z.string().optional()
});

type EncryptType = z.infer<typeof encryptSchema>;

export { encryptSchema, type EncryptType };
