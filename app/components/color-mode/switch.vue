<script setup lang="ts">
interface ColorModeProps {
    color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"
}

interface SwitchItem {
  label: string
  value: string
  icon: string
}

const {
    color = 'primary'
} = defineProps<ColorModeProps>()

const {
    light,
    dark,
} = useIcon();

const items = ref<SwitchItem[]>([
    { label: 'Light', value: 'light', icon: light },
    { label: 'Dark', value: 'dark', icon: dark },
])

const color_mode = useColorMode()

const value = ref<string>(color_mode.value.includes('dark') ? 'dark' : 'light')

function onChange(_: string|number)  {
    value.value = _.toString()
    color_mode.forced = true
    color_mode.preference = value.value
    color_mode.value = value.value
}
</script>

<template>
    <div>
        <UTabs
            :items="items"
            size="lg"
            class="w-full"
            :color="color"
            @update:model-value="onChange"
            v-model:model-value="value"
        />
    </div>
</template>
