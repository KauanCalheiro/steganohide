import z from "zod";

const encryptSchema = z.object({
    file: z.instanceof(File, { message: "File is required" }),
    message: z.string().optional(),
    secretFile: z.instanceof(File).optional(),
    contentType: z.enum(['text', 'file']).default('text'),
    secretKey: z.string().optional()
}).refine((data) => {
    if (data.contentType === 'text') {
        return data.message && data.message.length > 0;
    } else {
        return data.secretFile instanceof File;
    }
}, {
    message: "Message or file is required",
    path: ["message"]
});

type EncryptType = z.infer<typeof encryptSchema>;

export { encryptSchema, type EncryptType };
