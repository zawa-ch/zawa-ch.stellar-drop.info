<template>
	<div class="auto-grid">
		<slot></slot>
	</div>
</template>

<style lang="css">
div.auto-grid {
	display: grid;
	container: auto-grid / inline-size;
	column-gap: 1.5rem;
}

@media screen and (not (width < 1200px)) {
	div.auto-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media screen and (not (width < 800px)) and (width < 1200px) {
	div.auto-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media screen and (width < 800px) {
	div.auto-grid {
		grid-template-columns: repeat(1, 1fr);
	}
}
</style>
