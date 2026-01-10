<script setup lang="ts">
interface SwitchItem {
  label: string
  value: string
  icon: string
}

const {
    light,
    dark,
} = useIcon();

const items = ref<SwitchItem[]>([
    { label: 'Light', value: 'light', icon: light },
    { label: 'Dark', value: 'dark', icon: dark },
])

const color = useColorMode()

const value = ref<string>(color.value.includes('dark') ? 'dark' : 'light')

function onChange(_: string|number)  {
    value.value = _.toString()
    color.forced = true
    color.preference = value.value
    color.value = value.value
}
</script>

<template>
    <div>
        <UTabs
            :items="items"
            size="lg"
            class="w-full"
            @update:model-value="onChange"
            v-model:model-value="value"
        />
    </div>
</template>
