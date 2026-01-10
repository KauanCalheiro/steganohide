<script setup lang="ts">
const {
    qr_code
} = useIcon();
</script>

<template>
    <div class="inline-flex items-center">
        <span class="text-3xl font-black">
            STEGAN
        </span>

        <UIcon :name="qr_code" class="h-8 w-8 text-3xl" />

        <span class="text-3xl font-black">
            S
        </span>
    </div>
</template>
