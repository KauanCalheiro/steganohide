<script setup lang="ts">
const model = defineModel<string>()

defineProps<{
    placeholder?: string
    showStrength?: boolean
}>()

const { eye, eye_closed, circle_check, circle_x } = useIcon()

const showPassword = ref(false)

function checkStrength(str: string) {
    const requirements = [
        { regex: /.{8,}/, key: 'min-length' },
        { regex: /\d/, key: 'number' },
        { regex: /[a-z]/, key: 'lowercase' },
        { regex: /[A-Z]/, key: 'uppercase' },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, key: 'special' }
    ]

    return requirements.map(req => ({ met: req.regex.test(str), key: req.key }))
}

const strength = computed(() => checkStrength(model.value || ''))
const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
    if (score.value === 0) return 'neutral'
    if (score.value <= 2) return 'error'
    if (score.value <= 3) return 'warning'
    if (score.value === 4) return 'warning'
    return 'success'
})

const textKey = computed(() => {
    if (score.value === 0) return 'enter'
    if (score.value <= 2) return 'weak'
    if (score.value <= 4) return 'medium'
    return 'strong'
})
</script>

<template>
    <div class="w-full space-y-2">
        <UInput
            v-model="model"
            :type="showPassword ? 'text' : 'password'"
            variant="soft"
            :placeholder="placeholder"
            :color="color"
            :aria-invalid="score < 4"
            aria-describedby="password-strength"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
        >
            <template #trailing>
                <UButton
                    color="neutral"
                    variant="link"
                    :icon="showPassword ? eye_closed : eye"
                    :aria-label="showPassword ? $t('password.hide') : $t('password.show')"
                    :aria-pressed="showPassword"
                    aria-controls="password"
                    @click="showPassword = !showPassword"
                />
            </template>
        </UInput>

        <template v-if="showStrength">
            <UProgress
                :color="color"
                :indicator="$t(`password.strength.${textKey}`)"
                :model-value="score"
                :max="5"
                size="md"
                class="w-[98%] mx-auto"
            />

            <p id="password-strength" class="text-sm font-medium">
                {{ $t(`password.strength.${textKey}`) }}. {{ $t('password.must-contain') }}:
            </p>

            <ul class="space-y-1" aria-label="Password requirements">
                <li
                    v-for="(req, index) in strength"
                    :key="index"
                    class="flex items-center gap-0.5"
                    :class="req.met ? 'text-success' : 'text-muted'"
                >
                    <UIcon
                        :name="req.met ? circle_check : circle_x"
                        class="size-4 shrink-0"
                    />

                    <span class="text-xs font-light">
                        {{ $t(`password.requirements.${req.key}`) }}
                        <span class="sr-only">
                            {{ req.met ? $t('password.requirement-met') : $t('password.requirement-not-met') }}
                        </span>
                    </span>
                </li>
            </ul>
        </template>
    </div>
</template>
