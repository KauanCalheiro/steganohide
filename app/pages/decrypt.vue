<script setup lang="ts">
const decodedMessage = ref<string | null>(null)

const hasDecodedMessage = computed(() => !!decodedMessage.value)

function onDecoded(message: string) {
    decodedMessage.value = message
}

function onReset() {
    decodedMessage.value = null
}
</script>

<template>
    <div>
        <DecryptForm
            v-if="!hasDecodedMessage"
            @decoded="onDecoded"
        />
        <DecryptView
            v-else
            :message="decodedMessage!"
            @reset="onReset"
        />
    </div>
</template>
