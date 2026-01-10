<script setup lang="ts">
interface NavbarItem {
  label: string
  value: string
  icon: string
}

const {
    isMobile
} = useDevice();

const {
    encrypt,
    decrypt,
    about,
    setting,
} = useIcon();

const items = ref<NavbarItem[]>([
    { label: label('Encrypt'), value: '/encrypt', icon: encrypt },
    { label: label('Decrypt'), value: '/decrypt', icon: decrypt },
    { label: label('About'), value: '/about', icon: about },
    { label: label('Settings'), value: '/setting', icon: setting }
])

const route = useRoute();

const match = computed<string>((): string  => {
    const match = items.value.find(i => i.value === route.path);
    return match ? match.value : '/encrypt';
});

const value = ref<string>(match.value);

function label(label: string): string {
    return (computed(() => isMobile.value ? '' : label) as unknown) as string;
}

function onChange(value: string|number) {
    navigateTo((value as string));
}
</script>

<template>
    <nav class="fixed inset-x-0 bottom-4 z-50 px-6 max-w-xl mx-auto">
        <UTabs
            :items="items"
            v-model:model-value="value"
            @update:model-value="onChange"
            class="w-full"
            size="xl"
        />
    </nav>
</template>
