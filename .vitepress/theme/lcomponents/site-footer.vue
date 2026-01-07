<template>
	<footer class="site-footer">
		<nav>
			<a v-for="value in theme.footer?.navigation" :href="URIRef.parse(value.href)?.href"
				:target="isLocalTarget(URIRef.parse(value.href)) ? undefined : '_blank'">{{ value.name }}</a>
		</nav>
		<p>
			{{ theme.footer?.copyright }}<br />
			<small>{{ theme.footer?.message }}</small>
		</p>
	</footer>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { URIRef } from '../utils/uri'
import { ThemeConfig } from '../config';

const { theme } = useData<ThemeConfig>();

function isLocalTarget(ref: URIRef | null) {
	if (!ref) { return false; }
	return !ref.authority && !ref.scheme;
}
</script>

<style lang="css" scoped>
footer.site-footer {
	padding-block-start: 8rem;
	padding-block-end: 2rem;
	padding-inline: min(5%, 4rem);
}

footer.site-footer nav {
	display: flex;
	flex-flow: column;
	align-items: flex-start;
	row-gap: 0.5rem;
}
</style>
