<script setup lang="ts">
export interface Country {
    name: string;
    code: 'pt_br' | 'en';
    icon: string;
}

const modelValue = defineModel<Country>()

const countries = ref<Country[]>([
    { name: 'English', code: 'en', icon: 'emojione-v1:flag-for-united-states' },
    { name: 'Português', code: 'pt_br', icon: 'emojione-v1:flag-for-brazil' },
])
</script>

<template>
    <USelectMenu
        v-model:model-value="modelValue"
        :items="countries"
        label-key="icon"
        color="neutral"
        variant="soft"
        :search-input="false"
        :ui="{
            content: 'w-fit'
        }"
    >
        <template #item="{ item }">
            <span class="w-full flex items-center gap-2 px-2">
                <UIcon :name="item.icon" />
                {{ item.name }}
            </span>
        </template>

        <template #default>
            <div class="w-full flex flex-row justify-center items-center gap-4">
                <UIcon :name="modelValue!.icon" />
                {{ modelValue!.name }}
            </div>
        </template>
    </USelectMenu>
</template>
