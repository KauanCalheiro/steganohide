<script setup lang="ts">
const encodedImageUrl = ref<string | null>(null)

const hasEncodedImage = computed(() => !!encodedImageUrl.value)

function onEncoded(imageUrl: string) {
    encodedImageUrl.value = imageUrl
}

function onReset() {
    encodedImageUrl.value = null
}
</script>

<template>
    <div>
        <EncryptForm
            v-if="!hasEncodedImage"
            @encoded="onEncoded"
        />
        <EncryptView
            v-else
            :image-url="encodedImageUrl!"
            @reset="onReset"
        />
    </div>
</template>
