<template>
	<header class="site-header">
		<div class="body" :style="bodyStyle">
			<img class="logo" :alt="theme.branding?.logoAlt" :src="theme.branding?.logoSrc" :width="theme.branding?.logoWidth"
				:height="theme.branding?.logoHeight">
			<TypingLabel class="path" :value="route.path" />
			<div style="flex: 1;"></div>
			<HeaderNavigation v-if="!isNarrowView" />
		</div>
		<Transition name="progress">
			<GaugeMeter v-show="props.progress !== undefined" class="load-progress" origin="min"
				background-color="transparent" :value="props.progress ?? 1" />
		</Transition>
		<div class="edge"></div>
	</header>
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import { useResponsive } from '../composables/responsive';
import { computed } from 'vue';
import HeaderNavigation from './header-navigation.vue';
import GaugeMeter from '../lcomponents/gauge-meter.vue'
import { ThemeConfig } from '../config';
import TypingLabel from '../gcomponents/typing-label.vue';

const props = withDefaults(defineProps<{
	progress?: number | undefined;
}>(), {
	progress: undefined,
})

const { theme } = useData<ThemeConfig>();
const route = useRoute();
const { isNarrowView } = useResponsive();
const bodyStyle = computed(() => { return { marginLeft: isNarrowView.value ? '48px' : undefined }; });
</script>

<style lang="css">
header.site-header {
	width: 100vw;
	height: 64px;
	position: fixed;
	top: 0;
	z-index: 1024;
	background-color: rgb(from var(--color--bg) r g b /80%);
	backdrop-filter: blur(4px);
}

header.site-header>.body {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: calc(100% - 1px);
	max-height: calc(100% - 1px);
	padding-inline: 32px;
	column-gap: 16px;
}

header.site-header img.logo {
	display: block;
	max-height: 100%;
}

header.site-header .path {
	font-family: 'Courier New', Courier, monospace;
	font-size: small;
	overflow-x: hidden;
	text-wrap: nowrap;
	text-overflow: ellipsis;
}

.load-progress {
	width: 100%;
	position: absolute;
	bottom: 0;
}

.progress-enter-active {
	transition: all 200ms ease;
}

.progress-leave-active {
	transition: all 500ms ease;
}

.progress-enter-from,
.progress-leave-to {
	opacity: 0;
}

header.site-header>.edge {
	height: 1px;
	max-height: 1px;
	width: 100%;
	background-color: var(--color--shadow);
}
</style>
