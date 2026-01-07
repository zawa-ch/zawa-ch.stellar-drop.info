<template>
	<div class="gauge-meter" :style="gaugeBgStyle">
		<div :style="gaugeStyle">
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type Origin = 'min' | 'zero' | 'max';

const props = withDefaults(defineProps<{
	origin?: Origin;
	height?: number;
	rounded?: boolean;
	value?: number;
	min?: number;
	max?: number;
	backgroundColor?: string;
	color?: string;
}>(), {
	origin: 'zero',
	height: 2,
	rounded: false,
	value: 0,
	min: 0,
	max: 1,
	backgroundColor: 'hsl(from var(--color--black) h s l /var(--scale-xF4))',
	color: 'var(--color--accent-fg)',
})

function getPercentile(value: number): number {
	if (props.max <= props.min) { return 100 }
	if (value < props.min) { return 0 }
	if (props.max < value) { return 100 }
	return 100 * (value - props.min) / (props.max - props.min)
}

const zeropoint = computed(() => {
	switch (props.origin) {
		case 'min': return 0;
		case 'max': return 100;
		default:
		case 'zero': return getPercentile(0);
	}
})
const valuepoint = computed(() => getPercentile(props.value))
const barBegin = computed(() => zeropoint.value <= valuepoint.value ? zeropoint.value : valuepoint.value)
const barEnd = computed(() => zeropoint.value <= valuepoint.value ? valuepoint.value : zeropoint.value)
const gaugeBgStyle = computed(() => {
	return {
		'background-color': props.backgroundColor,
		height: `${props.height}px`,
		'border-radius': props.rounded ? `${props.height}px` : '0',
	}
})
const gaugeStyle = computed(() => {
	return {
		'background-color': props.color,
		'margin-left': `${barBegin.value}%`,
		'margin-right': `${100 - barEnd.value}%`,
		'border-radius': props.rounded ? `${props.height}px` : '0',
	}
})
</script>

<style lang="css" scoped>
.gauge-meter {
	overflow: hidden;
}

.gauge-meter>div {
	position: relative;
	height: 100%;
	transition:
		margin-left 200ms cubic-bezier(0.075, 0.82, 0.165, 1),
		margin-right 200ms cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
