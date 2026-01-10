<script setup lang="ts">
interface DecryptViewProps {
    message: string
}

const {
    message
} = defineProps<DecryptViewProps>()

const emit = defineEmits<{
    reset: []
}>()

const {
    back,
    copy,
    success
} = useIcon()

const toast = useToaster()
const copied = ref(false)

async function copyMessage() {
    try {
        await navigator.clipboard.writeText(message)
        copied.value = true
        toast.success({
            title: 'Copied',
            description: 'Message copied to clipboard!'
        })
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch {
        toast.error({
            title: 'Error',
            description: 'Failed to copy message'
        })
    }
}

function goBack() {
    emit('reset')
}
</script>

<template>
    <div class="flex flex-col gap-8">
        <div class="w-full">
            <UFormField
                label="Decoded Message"
                class="w-full"
            >
                <UTextarea
                    :model-value="message"
                    variant="soft"
                    class="w-full"
                    autoresize
                    readonly
                />
            </UFormField>
        </div>
        <div class="flex gap-4 items-center">
            <UButton
                :icon="!copied ? copy : success"
                trailing
                class="w-full flex flex-row items-center justify-center"
                @click="copyMessage"
            >
                {{ copied ? 'Copied!' : 'Copy' }}
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
