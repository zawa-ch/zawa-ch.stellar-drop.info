<template>
	<Transition name="drawer">
		<div v-if="drawing" class="site-drawer modal" aria-modal="true">
			<div class="drawable">
				<div class="site-drawer content-root">
					<div class="logo-container">
						<img class="logo" :alt="theme.branding?.logoAlt" :src="theme.branding?.logoSrc"
							:width="theme.branding?.logoWidth" :height="theme.branding?.logoHeight">
					</div>
					<HeaderNavigation @navigate="drawing = false" direction="column" />
				</div>
			</div>
			<Activatable style="flex: 1; height: 100%;" @activate="drawing = false" />
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { Transition } from 'vue';
import { useData } from 'vitepress';
import { ThemeConfig } from '../config';
import Activatable from './activatable.vue'
import HeaderNavigation from './header-navigation.vue';

const { theme } = useData<ThemeConfig>();

const drawing = defineModel<boolean>('drawing', { required: true });
</script>

<style lang="css" scoped>
.site-drawer.modal {
	display: flex;
	flex-direction: row;
	position: fixed;
	inset: 0;
	z-index: 65535;
	background-color: hsl(from var(--color--bg) h s l /75%);
	opacity: 1;
}

.drawer-enter-active,
.drawer-enter-active * {
	transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);
}

.drawer-leave-active,
.drawer-leave-active * {
	transition: all 300ms ease-in;
}

.site-drawer.modal.drawer-enter-from,
.site-drawer.modal.drawer-leave-to {
	opacity: 0;
}

.site-drawer.modal .drawable {
	overflow: hidden;
	width: 320px;
	height: 100%;
}


.site-drawer.modal.drawer-enter-from .drawable,
.site-drawer.modal.drawer-leave-to .drawable {
	width: 0;
}

.site-drawer.content-root {
	width: 320px;
	height: 100%;
	background-color: var(--color--bg);
}

.site-drawer.content-root>.logo-container {
	display: block;
	height: 63px;
	margin-left: 80px;
	margin-bottom: 1px;
	align-content: center;
}

.site-drawer.content-root img.logo {
	display: block;
	max-height: 100%;
}

.site-drawer.content-root>.header-navigation {
	margin: 24px;
}
</style>
