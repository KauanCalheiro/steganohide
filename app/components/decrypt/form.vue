<script setup lang="ts">
import { decryptSchema, type DecryptType } from '~/schemas/decrypt'

const { t } = useI18n()

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
            title: t('common.success'),
            description: t('decrypt.success-message')
        })
    } catch (err) {
        toast.error({
            title: t('common.error'),
            description: error.value || t('decrypt.error-message')
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
            :label="$t('decrypt.image-label')"
            class="w-full"
            name="file"
            required
        >
            <UFileUpload
                v-model="state.file"
                variant="area"
                accept="image/*"
                class="w-full h-fit"
                :interactive="true"
                :label="$t('decrypt.image-upload')"
                :description="$t('decrypt.image-description')"
                :icon="image"
            />
        </UFormField>

        <UFormField
            :label="$t('decrypt.password-label')"
            class="w-full"
            name="secretKey"
        >
            <PasswordInput
                v-model="state.secretKey"
                :placeholder="$t('decrypt.password-placeholder')"
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
                    {{ $t('common.decrypt') }}
                </template>
                <template v-else>
                    <AppLoading class="w-6 h-6" />
                </template>
            </UButton>
        </div>
    </UForm>
</template>
