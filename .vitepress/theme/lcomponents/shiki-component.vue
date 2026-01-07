<template>
	<HastComponent v-if="hast" :ast="hast" trusted />
	<pre v-else><code>{{ props.code }}</code></pre>
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
	code: '',
	lang: 'ansi',
});
const hast = ref<HRoot | null>(null);
const lang = computed(() => Object.keys(bundledLanguages).includes(props.lang) ? props.lang : 'plain');
const shikiTheme = computed(() => props.theme ?? theme.value.markdown?.shikiTheme ?? 'github-dark');
watch(() => { return { code: props.code, lang }; }, (v) => {
	codeToHast(v.code, { lang: v.lang.value, theme: shikiTheme.value }).then((ast) => { hast.value = ast; }, (e) => { console.error(Error('Shiki runtime error', { cause: e })); hast.value = null; });
}, { immediate: true });
</script>
