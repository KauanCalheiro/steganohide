<script setup lang="ts">
const {
    info,
    shield,
    warning,
    setting,
    image,
    eye_closed
} = useIcon()
</script>

<template>
    <div class="w-full flex flex-col gap-4">
        <UCard variant="soft" class="w-full">
            <div class="flex flex-col gap-4 w-full">
                <AppTitle class="gap-4">
                    <UBadge variant="solid" size="xl" :icon="info" color="info" />
                    {{ $t('about.what-is.title') }}
                </AppTitle>
                <p class="text-sm text-muted leading-relaxed">
                    {{ $t('about.what-is.description') }}
                </p>
            </div>
        </UCard>

        <UCard variant="soft" class="w-full">
            <div class="flex flex-col gap-4 w-full">
                <AppTitle class="gap-4">
                    <UBadge variant="solid" size="xl" :icon="setting" color="primary" />
                    {{ $t('about.how-it-works.title') }}
                </AppTitle>
                <div class="flex flex-col gap-3">
                    <div class="flex items-start gap-3">
                        <UIcon :name="image" class="text-lg text-primary mt-1 shrink-0" />
                        <p class="text-sm text-muted leading-relaxed">
                            {{ $t('about.how-it-works.step-1') }}
                        </p>
                    </div>
                    <div class="flex items-start gap-3">
                        <UIcon :name="eye_closed" class="text-lg text-primary mt-1 shrink-0" />
                        <p class="text-sm text-muted leading-relaxed">
                            {{ $t('about.how-it-works.step-2') }}
                        </p>
                    </div>
                    <div class="flex items-start gap-3">
                        <UIcon :name="shield" class="text-lg text-primary mt-1 shrink-0" />
                        <p class="text-sm text-muted leading-relaxed">
                            {{ $t('about.how-it-works.step-3') }}
                        </p>
                    </div>
                </div>
            </div>
        </UCard>

        <UAlert
            :icon="warning"
            color="warning"
            variant="soft"
            :title="$t('about.warning.title')"
            :description="$t('about.warning.description')"
        />
    </div>
</template>
