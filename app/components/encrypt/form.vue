<script setup lang="ts">
import { encryptSchema, type EncryptType } from '~/schemas/encrypt'

const { t } = useI18n()

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
            title: t('common.success'),
            description: t('encrypt.success-message')
        })
    } catch (err) {
        toast.error({
            title: t('common.error'),
            description: error.value || t('encrypt.error-message')
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
            :label="$t('encrypt.image-label')"
            class="w-full"
            name="file"
        >
            <UFileUpload
                v-model="state.file"
                variant="area"
                accept="image/*"
                class="w-full h-fit"
                :interactive="true"
                :label="$t('encrypt.image-upload')"
                :description="$t('encrypt.image-description')"
                :icon="image"
            />
        </UFormField>

        <UFormField
            :label="$t('encrypt.message-label')"
            class="w-full"
            name="message"
        >
            <UTextarea
                v-model="state.message"
                variant="soft"
                :placeholder="$t('encrypt.message-placeholder')"
                class="w-full"
                autoresize
            />
        </UFormField>

        <UFormField
            :label="$t('encrypt.secret-key-label')"
            class="w-full"
            name="secretKey"
        >
            <UInput
                v-model="state.secretKey"
                type="password"
                variant="soft"
                :placeholder="$t('encrypt.secret-key-placeholder')"
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
                    {{ $t('common.encrypt') }}
                </template>
                <template v-else>
                    <AppLoading class="w-6 h-6" />
                </template>
            </UButton>
        </div>
    </UForm>
</template>
