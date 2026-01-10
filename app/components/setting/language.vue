<script setup lang="ts">
const { locale, setLocale } = useI18n()

const {
    language
} = useIcon()

</script>

<template>
    <div>
        <UCard
            variant="soft"
            class="w-full"
        >
            <div class="flex flex-col gap-8 w-full">
                <div>
                    <AppTitle class="gap-4">
                        <UBadge
                            variant="solid"
                            size="xl"
                            :icon="language"
                            color="warning"
                        />
                        {{ $t('settings.language') }}
                    </AppTitle>
                </div>

                <div class="flex flex-col gap-4">
                    <AppSubtitle class="font-bold">
                        {{ $t('settings.language-description') }}
                    </AppSubtitle>
                    <LocaleSelector />
                </div>
            </div>
        </UCard>
    </div>
</template>
