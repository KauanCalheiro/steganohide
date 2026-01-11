<script setup lang="ts">
const { t } = useI18n()

interface DecodedContent {
    type: 'text' | 'file'
    message?: string
    fileName?: string
    fileData?: Uint8Array
}

interface DecryptViewProps {
    content: DecodedContent
}

const {
    content
} = defineProps<DecryptViewProps>()

const emit = defineEmits<{
    reset: []
}>()

const {
    back,
    copy,
    success,
    download
} = useIcon()

const { downloadFile } = useSteganography()
const toast = useToaster()
const copied = ref(false)

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function copyMessage() {
    if (!content.message) return

    try {
        await navigator.clipboard.writeText(content.message)
        copied.value = true
        toast.success({
            title: t('common.copied'),
            description: t('decrypt.copy-success')
        })
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch {
        toast.error({
            title: t('common.error'),
            description: t('decrypt.copy-error')
        })
    }
}

function handleDownload() {
    if (!content.fileName || !content.fileData) return

    try {
        downloadFile(content.fileName, content.fileData)
        toast.success({
            title: t('common.success'),
            description: t('decrypt.download-success')
        })
    } catch {
        toast.error({
            title: t('common.error'),
            description: t('decrypt.download-error')
        })
    }
}

function goBack() {
    emit('reset')
}
</script>

<template>
    <div class="flex flex-col gap-8">
        <div v-if="content.type === 'text'" class="w-full">
            <UFormField
                :label="$t('decrypt.decoded-message-label')"
                class="w-full"
            >
                <UTextarea
                    :model-value="content.message"
                    variant="soft"
                    class="w-full"
                    autoresize
                    readonly
                />
            </UFormField>
        </div>

        <div v-else class="w-full">
            <UFormField
                :label="$t('decrypt.decoded-file-label')"
                class="w-full"
            >
                <div class="flex items-center gap-4 p-4 rounded-lg bg-elevated border border-default">
                    <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <UIcon
                            name="i-heroicons-document-text"
                            class="w-6 h-6 text-primary"
                        />
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">
                            {{ content.fileName }}
                        </p>
                        <p class="text-xs text-muted">
                            {{ formatFileSize(content.fileData?.length || 0) }}
                        </p>
                    </div>
                </div>
            </UFormField>
        </div>

        <div class="flex gap-4 items-center">
            <UButton
                v-if="content.type === 'text'"
                :icon="!copied ? copy : success"
                trailing
                class="w-full flex flex-row items-center justify-center"
                @click="copyMessage"
            >
                {{ copied ? $t('common.copied') : $t('common.copy') }}
            </UButton>

            <UButton
                v-else
                :icon="download"
                trailing
                class="w-full flex flex-row items-center justify-center"
                @click="handleDownload"
            >
                {{ $t('common.download') }}
            </UButton>

            <UButton
                :icon="back"
                square
                class="px-4 flex flex-row items-center justify-center"
                @click="goBack"
            />
        </div>
    </div>
</template>
