<script setup lang="ts">
const {
    qr_code
} = useIcon();
</script>

<template>
    <div class="inline-flex items-center text-inverted">
        <span class="text-3xl">
            STEGAN
        </span>

        <UIcon :name="qr_code" class="h-8 w-8 text-3xl" />

        <span class="text-3xl">
            S
        </span>
    </div>
</template>
