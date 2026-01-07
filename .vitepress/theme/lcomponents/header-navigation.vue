<template>
	<nav class="header-navigation" :style="{ flexFlow: props.direction }">
		<a v-for="value in theme.navigation" :href="URIRef.parse(value.href)?.href"
			:target="isLocalTarget(URIRef.parse(value.href)) ? undefined : '_blank'">{{ value.name }}</a>
	</nav>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { URIRef } from '../utils/uri';
import { ThemeConfig } from '../config';

const props = withDefaults(defineProps<{
	direction?: 'row' | 'column';
}>(), {
	direction: 'row',
});

const { theme } = useData<ThemeConfig>();

function isLocalTarget(ref: URIRef | null) {
	if (!ref) { return false; }
	return !ref.authority && !ref.scheme;
}
</script>

<style lang="css">
nav.header-navigation {
	display: flex;
	column-gap: 1.5rem;
}

nav.header-navigation a {
	color: var(--color--fg);
	font-size: 1.2rem;
	line-height: 48px;
}

nav.header-navigation :any-link {
	text-decoration-line: underline;
	text-decoration-style: solid;
	text-decoration-color: transparent;
	text-decoration-thickness: 1px;
	transition: text-decoration-color 250ms ease-out;
}

nav.header-navigation :any-link:hover {
	text-decoration-color: var(--color--fg);
}
</style>
