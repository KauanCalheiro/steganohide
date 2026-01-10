<script setup lang="ts">
const { t } = useI18n()

interface EncryptViewProps {
    imageUrl: string
}

const {
    imageUrl
} = defineProps<EncryptViewProps>()

const emit = defineEmits<{
    reset: []
}>()

const {
    back,
    download,
    share,
    warning
} = useIcon()

const toast = useToaster()

async function downloadImage() {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `steganohide-${Date.now()}.png`
    link.click()
}

async function shareImage() {
    if (!navigator.share) {
        toast.error({
            title: t('common.error'),
            description: t('common.share-not-supported')
        })
        return
    }

    try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'steganohide.png', { type: 'image/png' })

        await navigator.share({
            title: 'Steganohide Image',
            text: 'Check out this image with a hidden message!',
            files: [file]
        })
    } catch (err) {
        if ((err as Error).name !== 'AbortError') {
            toast.error({
                title: t('common.error'),
                description: t('common.share-failed')
            })
        }
    }
}

function goBack() {
    emit('reset')
}
</script>

<template>
    <div class="flex flex-col gap-8">
        <div class="w-full flex justify-center">
            <img
                :src="imageUrl"
                alt="Encoded image"
                class="max-w-full max-h-96 rounded-lg shadow-lg object-contain"
            >
        </div>
        <div class="flex gap-4 items-center">
            <UButton
                :icon="download"
                trailing
                class="w-full flex flex-row items-center justify-center"
                @click="downloadImage"
            >
                {{ $t('common.download') }}
            </UButton>

            <UButton
                :icon="share"
                trailing
                class="w-full flex flex-row items-center justify-center"
                @click="shareImage"
            >
                {{ $t('common.share') }}
            </UButton>

            <UButton
                :icon="back"
                square
                class="px-4 flex flex-row items-center justify-center"
                @click="goBack"
            />
        </div>

        <UAlert
            :icon="warning"
            color="warning"
            variant="soft"
            :title="$t('about.warning.title')"
            :description="$t('about.warning.description')"
        />
    </div>
</template>
