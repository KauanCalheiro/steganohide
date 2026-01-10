<script setup lang="ts">
const { t } = useI18n()

interface NavbarItem {
    label: string
    value: string
    icon: string
}

const {
    isMobile
} = useDevice()

const {
    encrypt,
    decrypt,
    about,
    setting
} = useIcon()

const items = computed<NavbarItem[]>(() => [
    { label: isMobile.value ? '' : t('common.encrypt'), value: '/encrypt', icon: encrypt },
    { label: isMobile.value ? '' : t('common.decrypt'), value: '/decrypt', icon: decrypt },
    { label: isMobile.value ? '' : t('about.title'), value: '/about', icon: about },
    { label: isMobile.value ? '' : t('settings.title'), value: '/setting', icon: setting }
])

const route = useRoute()

const match = computed<string>((): string => {
    const matched = items.value.find(i => i.value === route.path)
    return matched ? matched.value : '/encrypt'
})

const value = ref<string>(match.value)

function onChange(value: string | number) {
    navigateTo((value as string))
}
</script>

<template>
    <nav class="fixed inset-x-0 bottom-0 md:bottom-8 z-50 px-6 max-w-3xl mx-auto">
        <UTabs
            :items="items"
            v-model:model-value="value"
            @update:model-value="onChange"
            class="w-full"
            size="xl"
        />
    </nav>
</template>
