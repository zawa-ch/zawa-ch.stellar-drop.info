import { onMounted, onUnmounted, ref } from "vue";

export function useResponsive() {
	const isNarrowView = ref(false);
	const calcIsNarrowView = () => { try { return (visualViewport?.width ?? 600) < 600; } catch (e) { return undefined; } }
	function updateResponsive() {
		isNarrowView.value = calcIsNarrowView() ?? false;
	}
	onMounted(() => {
		updateResponsive();
		window.addEventListener('resize', updateResponsive);
	})
	onUnmounted(() => {
		window.removeEventListener('resize', updateResponsive);
	})
	return { isNarrowView };
}
