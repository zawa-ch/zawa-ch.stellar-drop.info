<template>
	<div class="progress-gauge root">
		<div style="box-sizing: border-box; display: flex; align-items: end; padding-inline: 4px;">
			<span style="font-size: 90%;">{{ props.label }}</span>
			<span v-if="props.valueDisplay != 'none'"
				style="margin-left: auto; font-size: 75%; font-weight: 600; vertical-align: bottom;">
				{{ valueText }}
			</span>
		</div>
		<GaugeMeter class="progress-gauge progress" :value="props.value" :min="props.min" :max="props.max"
			:color="props.color" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GaugeMeter from '../lcomponents/gauge-meter.vue';
const props = withDefaults(defineProps<{
	value?: number
	min?: number
	max?: number
	color?: string
	label?: string
	valueDisplay?: 'none' | 'percentage' | 'value' | 'fraction'
}>(), {
	value: 0,
	min: 0,
	max: 1,
	label: '',
	valueDisplay: 'none',
})

const valueText = computed(() => {
	switch (props.valueDisplay) {
		case 'value': return `${props.value}`
		case 'percentage': return `${(100 * (props.value - props.min) / (props.max - props.min)).toPrecision(2)}%`
		case 'fraction': return `${props.value} / ${props.max}`
		default: return ''
	}
})
</script>

<style scoped>
.progress-gauge.root {
	box-sizing: border-box;
	width: 100%;
	padding-inline: 8px;
	margin-block: 4px;
}

.progress-gauge.progress {
	margin-top: 2px;
}
</style>
