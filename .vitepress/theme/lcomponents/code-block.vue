<template>
	<div :class="`language-${props.lang}`">
		<button class="copy" title="Copy Code"></button>
		<span class="lang">{{ props.lang }}</span>
		<HastComponent v-if="hast" :ast="hast" trusted />
		<pre v-else><code>{{ props.code }}</code></pre>
	</div>
</template>

<script setup lang="ts">
import { bundledLanguages, BundledTheme, codeToHast, CodeToHastOptionsCommon, ThemeRegistrationAny } from 'shiki';
import HastComponent, { HRoot } from "./hast-component";
import { computed, ref, watch } from 'vue';
import { useData } from 'vitepress';
import { ThemeConfig } from '../config';
const { theme } = useData<ThemeConfig>();
const props = withDefaults(defineProps<{
	code?: string;
	lang?: CodeToHastOptionsCommon['lang'];
	theme?: ThemeRegistrationAny | BundledTheme;
}>(), {
});
const hast = ref<HRoot | null>(null);
const lang = computed(() => props.lang && Object.keys(bundledLanguages).includes(props.lang) ? props.lang : 'plain');
const shikiTheme = computed(() => props.theme ?? theme.value.markdown?.shikiTheme ?? 'github-dark');
watch(() => { return { code: props.code, lang }; }, (v) => {
	codeToHast(v.code ?? '', { lang: v.lang.value, theme: shikiTheme.value }).then((ast) => { hast.value = ast; }, (e) => { console.error(Error('Shiki runtime error', { cause: e })); hast.value = null; });
}, { immediate: true });
</script>
