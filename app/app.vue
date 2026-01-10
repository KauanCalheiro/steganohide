<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Steganohide' }
  ],
})

import type { ToasterProps } from '@nuxt/ui';

const toaster = ref<ToasterProps>({
    position: 'bottom-center',
    expand: false,
})
</script>

<template>
    <UApp
        :toaster="toaster"
    >
        <NuxtPwaAssets />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
