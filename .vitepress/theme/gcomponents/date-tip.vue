<template>
	<time class="time-tip" :datetime="isoDateString">
		<span class="abs">{{ dateString }}</span>
		<span class="rel"><span class="bracket">(</span>{{ relativeString }}<span class="bracket">)</span></span>
	</time>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

export type Fuzzyness = 'full' | 'second' | 'minute' | 'five-min' | 'half-hour' | 'hour' | 'quater-day' | 'half-day' | 'day' | 'month' | 'year';

const props = withDefaults(defineProps<{
	date?: string | number;
	fuzzyness?: Fuzzyness;
}>(), {
	fuzzyness: 'full'
});

const fuzzynessFactor = computed(() => getFuzzynessFactor(props.fuzzyness))
function getFuzzynessFactor(fuzzyness: Fuzzyness): number {
	switch (fuzzyness) {
		case 'full': return 1;
		case 'second': return 1000;
		case 'minute': return 60000;
		case 'five-min': return 300000;
		case 'half-hour': return 1800000;
		case 'hour': return 3600000;
		case 'quater-day': return 1000;
		case 'half-day': return 1000;
		case 'day': return 1000;
		case 'month': return 1000;
		case 'year': return 1000;
		default: return NaN
	}
}

const accuracyDateValue = computed(() => typeof props.date == 'string' ? Date.parse(props.date) : props.date ?? NaN);
const dateValue = ref<Date>(new Date());

const dateString = computed(() => {
	if (Number.isNaN(dateValue.value.valueOf())) {
		return 'Invalid date'
	}
	switch (props.fuzzyness) {
		case 'full': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours().toString().padStart(2, '0')}:${dateValue.value.getMinutes().toString().padStart(2, '0')}:${dateValue.value.getSeconds().toString().padStart(2, '0')}.${dateValue.value.getMilliseconds().toString().padStart(3, '0')}`
		case 'second': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours().toString().padStart(2, '0')}:${dateValue.value.getMinutes().toString().padStart(2, '0')}:${dateValue.value.getSeconds().toString().padStart(2, '0')}`
		case 'minute': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours().toString().padStart(2, '0')}:${dateValue.value.getMinutes().toString().padStart(2, '0')}`
		case 'five-min': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours().toString().padStart(2, '0')}:${dateValue.value.getMinutes().toString().padStart(2, '0')}`
		case 'half-hour': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours().toString().padStart(2, '0')}:${dateValue.value.getMinutes().toString().padStart(2, '0')}`
		case 'hour': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours()}時ごろ`
		case 'quater-day': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours()}時ごろ`
		case 'half-day': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')} ${dateValue.value.getHours() >= 12 ? '午後' : '午前'}`
		case 'day': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')}`
		case 'month': return `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}`
		case 'year': return `${dateValue.value.getFullYear()}年`
		default: return 'invalid date'
	}
});

const isoDateString = computed(() => {
	try {
		return dateValue.value?.toISOString();
	} catch {
		return undefined
	}
});

const relativeString = ref(buildRelative(dateValue.value, new Date(Date.now()), props.fuzzyness));
const relativeStringUpdater = ref<number | undefined>(undefined);
function buildRelative(value: Date, anchor: Date, fuzzyness: Fuzzyness): string {
	if (Number.isNaN(dateValue.value.valueOf())) {
		return ''
	}
	switch (fuzzyness) {
		case 'full':
		case 'second': {
			const d = value.valueOf() - anchor.valueOf()
			return [
				{ cond: () => d >= -15000 && d < 15000, ev: () => 'たった今' },
				{ cond: () => d >= -60000 && d < 0, ev: () => 'すこし前' },
				{ cond: () => d >= 0 && d < 60000, ev: () => 'まもなく' },
				{ cond: () => d >= -300000 && d < 0, ev: () => `${(-d / 60000).toFixed(1)}分前` },
				{ cond: () => d >= 0 && d < 300000, ev: () => `${(d / 60000).toFixed(1)}分後` },
				{ cond: () => d >= -1800000 && d < 1800000, ev: () => buildRelative(value, anchor, 'minute') },
				{ cond: () => d >= -3600000 && d < 3600000, ev: () => buildRelative(value, anchor, 'five-min') },
				{ cond: () => d >= -21600000 && d < 21600000, ev: () => buildRelative(value, anchor, 'half-hour') },
				{ cond: () => d >= -43200000 && d < 43200000, ev: () => buildRelative(value, anchor, 'hour') },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'day') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'minute': {
			const d = value.valueOf() - anchor.valueOf()
			return [
				{ cond: () => d >= -1800000 && d < 0, ev: () => `${(-d / 60000).toFixed(0)}分前` },
				{ cond: () => d >= 0 && d < 1800000, ev: () => `${(d / 60000).toFixed(0)}分後` },
				{ cond: () => d >= -3600000 && d < 3600000, ev: () => buildRelative(value, anchor, 'five-min') },
				{ cond: () => d >= -21600000 && d < 21600000, ev: () => buildRelative(value, anchor, 'half-hour') },
				{ cond: () => d >= -43200000 && d < 43200000, ev: () => buildRelative(value, anchor, 'hour') },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'day') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'five-min': {
			const d = value.valueOf() - anchor.valueOf()
			return [
				{ cond: () => d >= -3600000 && d < 0, ev: () => `${(-d / 60000).toFixed(0)}分前` },
				{ cond: () => d >= 0 && d < 3600000, ev: () => `${(d / 60000).toFixed(0)}分後` },
				{ cond: () => d >= -21600000 && d < 21600000, ev: () => buildRelative(value, anchor, 'half-hour') },
				{ cond: () => d >= -43200000 && d < 43200000, ev: () => buildRelative(value, anchor, 'hour') },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'day') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'half-hour': {
			const d = value.valueOf() - anchor.valueOf()
			return [
				{ cond: () => d >= -21600000 && d < 0, ev: () => `${(-d / 3600000).toFixed(1)}時間前` },
				{ cond: () => d >= 0 && d < 21600000, ev: () => `${(d / 3600000).toFixed(1)}時間後` },
				{ cond: () => d >= -43200000 && d < 43200000, ev: () => buildRelative(value, anchor, 'hour') },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'day') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'hour': {
			const d = value.valueOf() - anchor.valueOf()
			return [
				{ cond: () => d >= -43200000 && d < 0, ev: () => `${(-d / 3600000).toFixed(0)}時間前` },
				{ cond: () => d >= 0 && d < 43200000, ev: () => `${(d / 3600000).toFixed(0)}時間後` },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'day') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'quater-day':
		case 'half-day':
		case 'day': {
			const d = value.valueOf() / 86400000 - anchor.valueOf() / 86400000
			return [
				{ cond: () => d >= -3 && d < 0, ev: () => `${-d.toFixed(1)}日前` },
				{ cond: () => d >= 0 && d < 3, ev: () => `${d.toFixed(1)}日後` },
				{ cond: () => d >= -15 && d < 0, ev: () => `${-d.toFixed(0)}日前` },
				{ cond: () => d >= 0 && d < 15, ev: () => `${d.toFixed(0)}日後` },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'month') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'month': {
			const d = (value.getFullYear() * 12 + value.getMonth()) - (anchor.getFullYear() * 12 + anchor.getMonth())
			return [
				{ cond: () => d == 0, ev: () => '今月' },
				{ cond: () => d == -1, ev: () => '先月' },
				{ cond: () => d == 1, ev: () => '来月' },
				{ cond: () => d >= -6 && d < 0, ev: () => `${-d}ヶ月前` },
				{ cond: () => d >= 0 && d < 6, ev: () => `${d}ヶ月後` },
				{ cond: () => true, ev: () => buildRelative(value, anchor, 'year') },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		case 'year': {
			const d = value.getFullYear() - anchor.getFullYear()
			return [
				{ cond: () => d == 0, ev: () => '今年' },
				{ cond: () => d == -1, ev: () => '昨年' },
				{ cond: () => d == 1, ev: () => '来年' },
				{ cond: () => d < 0, ev: () => `${-d}年前` },
				{ cond: () => d >= 0, ev: () => `${d}年後` },
			].find((v) => v.cond())?.ev() ?? 'error'
		}
		default: return ''
	}
}

watch(() => { return { date: props.date, fuzzyness: props.fuzzyness } }, () => {
	dateValue.value = new Date(accuracyDateValue.value - (accuracyDateValue.value % fuzzynessFactor.value));
	relativeString.value = buildRelative(dateValue.value, new Date(Date.now()), props.fuzzyness);
}, { immediate: true })

onMounted(() => {
	relativeStringUpdater.value = setInterval(() => { relativeString.value = buildRelative(dateValue.value, new Date(Date.now()), props.fuzzyness) }, 15000);
})
onUnmounted(() => {
	clearInterval(relativeStringUpdater.value);
})
</script>

<style lang="css" scoped>
.time-tip {
	display: inline-flex;
	flex-direction: column;
	border-radius: 6pt;
	border: 1px solid hsl(from var(--color--fg) h s l /50%);
	padding-block: 0;
	padding-inline: 4pt;
	vertical-align: middle;
	font: 0.75rem/1 var(--font-family--default);
	overflow: hidden;
}

.abs {
	display: inline;
}

.rel {
	display: inline;
	font-size: 0.6rem;
	opacity: 0.8;
}

.bracket {
	display: inline-block;
	width: 0;
	overflow: hidden;
}
</style>
