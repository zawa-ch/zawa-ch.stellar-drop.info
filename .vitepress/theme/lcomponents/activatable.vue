<template>
	<div @click="onClick" @keydown="onKeyDown">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
export type AppendKeys = {
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
	metaKey: boolean;
};

const emit = defineEmits<{
	activate: [appends: AppendKeys];
}>();

function onClick(e: PointerEvent) {
	emit('activate', { ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: e.metaKey, });
}

function onKeyDown(e: KeyboardEvent) {
	if (e.defaultPrevented) { return; }
	if (e.key === 'Enter') {
		emit('activate', { ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: e.metaKey, });
		return;
	}
}
</script>
