<script setup lang="ts">
const { color_palette } = useIcon();
</script>

<template>
    <div>
        <UCard
            variant="soft"
            class="w-full"
        >
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <AppTitle class="gap-2">
                        <UBadge
                            variant="solid"
                            size="xl"
                            :icon="color_palette"
                        />
                        Appearance
                    </AppTitle>
                </div>

                <div class="flex flex-col gap-2">
                    <AppSubtitle class="font-bold">
                        Color Mode
                    </AppSubtitle>
                    <ColorModeSwitch />
                </div>
            </div>
        </UCard>
    </div>
</template>
