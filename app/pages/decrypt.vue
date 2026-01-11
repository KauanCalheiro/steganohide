<script setup lang="ts">
interface DecodedContent {
    type: 'text' | 'file'
    message?: string
    fileName?: string
    fileData?: Uint8Array
}

const decodedContent = ref<DecodedContent | null>(null)

const hasDecodedContent = computed(() => !!decodedContent.value)

function onDecoded(content: DecodedContent) {
    decodedContent.value = content
}

function onReset() {
    decodedContent.value = null
}
</script>

<template>
    <div>
        <DecryptForm
            v-if="!hasDecodedContent"
            @decoded="onDecoded"
        />
        <DecryptView
            v-else
            :content="decodedContent!"
            @reset="onReset"
        />
    </div>
</template>
