<template>
	<Transition name="accordion" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave" @after-leave="onAfterLeave">
		<slot></slot>
	</Transition>
</template>

<script setup lang="ts">
function nextFrame(fn: () => void) {
	window.requestAnimationFrame(() => window.requestAnimationFrame(fn))
}

function onEnter(el: Element) {
	(el as HTMLElement).style.overflow = 'hidden';
	(el as HTMLElement).style.height = `${el.scrollHeight}px`;
}

function onAfterEnter(el: Element) {
	(el as HTMLElement).style.overflow = '';
	(el as HTMLElement).style.height = '';
}

function onLeave(el: Element) {
	(el as HTMLElement).style.overflow = 'hidden';
	(el as HTMLElement).style.height = `${el.scrollHeight}px`;
	nextFrame(() => (el as HTMLElement).style.height = '0')
}

function onAfterLeave(el: Element) {
	(el as HTMLElement).style.overflow = '';
	(el as HTMLElement).style.height = '';
}
</script>

<style>
.accordion-enter-active,
.accordion-leave-active {
	overflow: hidden;
	transition: all 0.5s ease;
}

.accordion-enter-from,
.accordion-leave-to {
	opacity: 0;
	height: 0;
}
</style>
