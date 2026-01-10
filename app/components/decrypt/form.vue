<script setup lang="ts">
import { decryptSchema, type DecryptType } from '~/schemas/decrypt'

const emit = defineEmits<{
    decoded: [message: string]
}>()

const {
    decrypt,
    image
} = useIcon()

const { decode, loading, error } = useSteganography()

const schema = decryptSchema
const state = reactive({} as DecryptType)

const toast = useToaster()

async function onSubmit() {
    try {
        const result = await decode(
            state.file,
            state.secretKey
        )
        emit('decoded', result.message)
        toast.success({
            title: 'Success',
            description: 'Message decoded successfully!'
        })
    } catch (err) {
        toast.error({
            title: 'Error',
            description: error.value || 'Failed to decode message'
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
                description="Upload an image with a hidden message"
                :icon="image"
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
                placeholder="Enter the secret key (optional)"
                class="w-full"
            />
        </UFormField>

        <div class="flex justify-end mx-4">
            <UButton
                type="submit"
                :icon="!loading ? decrypt : undefined"
                trailing
                :disabled="loading"
            >
                <template v-if="!loading">
                    Decrypt
                </template>
                <template v-else>
                    <AppLoading class="w-6 h-6" />
                </template>
            </UButton>
        </div>
    </UForm>
</template>
