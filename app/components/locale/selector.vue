<script setup lang="ts">
import type { Country } from './select.vue';


const { locale, setLocale } = useI18n()

const countries = ref<Country[]>([
    { name: 'English', code: 'en', icon: 'emojione-v1:flag-for-united-states' },
    { name: 'Português', code: 'pt_br', icon: 'emojione-v1:flag-for-brazil' },
])
const country = countries.value.find((c: Country) => c.code === locale.value)

const selectedCountry = ref<Country>(country!);

watch(selectedCountry, (newCountry) => {
    setLocale(newCountry.code);
});
</script>

<template>
    <LocaleSelect v-model:model-value="selectedCountry" />
</template>
