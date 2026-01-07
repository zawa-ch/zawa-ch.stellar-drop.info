<template>
	<span class="typewriter">{{ current }}</span>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
	value: string
	updateInterval?: number
}>(), {
	value: '',
	updateInterval: 50
});

// プッシュ/ポップのどちらをしているか。
const currentState = ref<'push' | 'pop'>('push');
// 表示中の文字列。
const target = ref(props.value);
// 先頭から何文字を表示するか。
const pickN = ref(0);
// 実際に表示する文字列。
const current = computed(() => { return target.value.substring(0, pickN.value) });

function advanceFrame() {
	switch (currentState.value) {
		case 'push':
			pickN.value = pickN.value < target.value.length ? pickN.value + 1 : pickN.value
			break
		case 'pop':
			if (pickN.value == 0 || props.value.startsWith(current.value)) {
				target.value = props.value
				currentState.value = 'push'
			} else {
				--pickN.value
			}
	}
}
let frameUpdater: number | undefined;

watch(() => props.value, (newValue) => {
	if (newValue.startsWith(current.value)) {
		target.value = props.value
		currentState.value = 'push'
	} else {
		currentState.value = 'pop'
	}
}, { immediate: true })
watch(() => props.updateInterval, (newValue) => {
	clearInterval(frameUpdater)
	frameUpdater = setInterval(advanceFrame, newValue)
})

onMounted(() => {
	frameUpdater = setInterval(advanceFrame, props.updateInterval)
})
onUnmounted(() => {
	clearInterval(frameUpdater)
})
</script>

<style lang="css" scoped>
.typewriter {
	/* 一部の環境ではwebフォントがちらつきの原因になるため、システム既定のフォントを使う */
	font-family: sans-serif;
}
</style>
