<template>
	<Activatable class="hamburger-menu" @activate="(appends) => emit('activate', appends)" tabindex="0">
		<svg width="48" height="48">
			<path d="M10,14h28M10,24h28M10,34h28" stroke="var(--color--fg)" stroke-width="4" stroke-linecap="round" />
		</svg>
	</Activatable>
</template>

<script setup lang="ts">
import Activatable, { AppendKeys } from './activatable.vue';

const emit = defineEmits<{
	activate: [appends: AppendKeys];
}>();
</script>

<style lang="css" scoped>
.hamburger-menu {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 65536;
	margin: 8px;
	cursor: pointer;
}
</style>
