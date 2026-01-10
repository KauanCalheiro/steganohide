<script setup lang="ts">
import { encryptSchema, type EncryptType } from '~/schemas/encrypt'

const emit = defineEmits<{
    encoded: [imageUrl: string]
}>()

const {
    encrypt,
    image
} = useIcon()

const { encode, loading, error } = useSteganography()

const schema = encryptSchema
const state = reactive({} as EncryptType)

const toast = useToaster()

async function onSubmit() {
    try {
        const result = await encode(
            state.file,
            state.message,
            state.secretKey
        )
        emit('encoded', result.imageUrl)
        toast.success({
            title: 'Success',
            description: 'Message encoded successfully!',
        })
    } catch (err) {
        toast.error({
            title: 'Error',
            description: error.value || 'Failed to encode message',
        })
    }
}
</script>

<template>
    <UForm
        class="flex flex-col gap-8"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
    >
        <UFormField
            label="Image"
            class="w-full"
            name="file"
        >
            <UFileUpload
                v-model="state.file"
                variant="area"
                accept="image/*"
                class="w-full h-fit"
                :interactive="true"
                label="Click or Drop to upload an image"
                description="Accepted formats: PNG, JPG, JPEG, GIF, WEBP, SVG..."
                :icon="image"
            />
        </UFormField>

        <UFormField
            label="Message"
            class="w-full"
            name="message"
        >
            <UTextarea
                v-model="state.message"
                variant="soft"
                placeholder="Enter the message to encrypt"
                class="w-full"
                autoresize
            />
        </UFormField>

        <UFormField
            label="Secret Key"
            class="w-full"
            name="secretKey"
        >
            <UInput
                v-model="state.secretKey"
                type="password"
                variant="soft"
                placeholder="Enter a secret key (optional)"
                class="w-full"
            />
        </UFormField>

        <div class="flex justify-end mx-4">
            <UButton
                type="submit"
                :icon="!loading ? encrypt : undefined"
                trailing
                :disabled="loading"
            >
                <template v-if="!loading">
                    Encrypt
                </template>
                <template v-else>
                    <AppLoading class="w-6 h-6" />
                </template>
            </UButton>
        </div>
    </UForm>
</template>
