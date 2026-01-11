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
const state = reactive<EncryptType>({
    contentType: 'text',
} as EncryptType)

const toast = useToaster()

const contentTabs = [
    { label: t('encrypt.tab-text'), value: 'text', icon: 'i-heroicons-chat-bubble-bottom-center-text' },
    { label: t('encrypt.tab-file'), value: 'file', icon: 'i-heroicons-document-plus' }
]

const activeTab = ref('text')

watch(activeTab, (newTab) => {
    state.contentType = newTab as 'text' | 'file'
})

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isFormValid = computed(() => {
    if (!state.file) return false
    if (state.contentType === 'text') {
        return state.message && state.message.length > 0
    } else {
        return state.secretFile instanceof File
    }
})

async function onSubmit() {
    try {
        let payload: { type: 'text'; data: string } | { type: 'file'; data: ArrayBuffer; fileName: string }

        if (state.contentType === 'text') {
            payload = {
                type: 'text',
                data: state.message || ''
            }
        } else {
            if (!state.secretFile) {
                throw new Error('No file selected')
            }
            const arrayBuffer = await state.secretFile.arrayBuffer()
            payload = {
                type: 'file',
                data: arrayBuffer,
                fileName: state.secretFile.name
            }
        }

        const result = await encode(
            state.file,
            payload,
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
            required
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
            :label="$t('encrypt.content-label')"
            class="w-full"
            name="message"
            required
        >
            <UTabs
                v-model="activeTab"
                :items="contentTabs"
                class="w-full"
            />

            <div
                v-if="activeTab == 'text'"
                class="pt-4"
            >
                <UTextarea
                    v-model="state.message"
                    variant="soft"
                    :placeholder="$t('encrypt.message-placeholder')"
                    class="w-full"
                    autoresize
                />
            </div>

            <div
                v-else
                class="pt-4 flex flex-col gap-3"
            >
                <UFileUpload
                    v-model="state.secretFile"
                    variant="area"
                    class="w-full"
                    :label="$t('encrypt.file-upload')"
                    :description="$t('encrypt.file-description')"
                    icon="i-heroicons-document-arrow-up"
                />
            </div>
        </UFormField>

        <UFormField
            :label="$t('encrypt.password-label')"
            class="w-full"
            name="secretKey"
        >
            <PasswordInput
                v-model="state.secretKey"
                :placeholder="$t('encrypt.password-placeholder')"
                :show-strength="true"
            />
        </UFormField>

        <div class="flex justify-end mx-4">
            <UButton
                type="submit"
                :icon="!loading ? encrypt : undefined"
                trailing
                :disabled="loading || !isFormValid"
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
