<script setup lang="ts">
const { color_palette } = useIcon()
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
                            :icon="color_palette"
                            color="info"
                        />
                        {{ $t('settings.appearance') }}
                    </AppTitle>
                </div>

                <div class="flex flex-col gap-4">
                    <AppSubtitle class="font-bold">
                        {{ $t('settings.color-mode') }}
                    </AppSubtitle>
                    <ColorModeSwitch color="info" />
                </div>
            </div>
        </UCard>
    </div>
</template>
