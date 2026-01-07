import { onMounted, ref } from "vue";

export function useWindow() {
	const sx = ref<number | undefined>(undefined);
	const sy = ref<number | undefined>(undefined);
	onMounted(() => {
		sx.value = window.scrollX;
		sy.value = window.scrollY;
		window.onscroll = () => {
			sx.value = window.scrollX;
			sy.value = window.scrollY;
		}
	})
	return { x: sx, y: sy };
}
