import { computed } from "vue";

export function useDocument() {
	const item = computed(() => globalThis.document ? document : null);
	return item;
}
