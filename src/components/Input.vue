<template>
	<input
		class="input"
		v-bind="$attrs"
		v-on="{
			...$listeners,
			input: (event) => $emit('input', event.target.value),
		}"
	/>
</template>
<script>
export default {
	inheritAttrs: false,
};
</script>
