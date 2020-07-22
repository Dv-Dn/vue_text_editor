<template>
	<div
		contenteditable
		class="edit__field"
		@input="handleInput"
		@keydown="handleKeydown"
	/>
</template>
<script>
const exec = (command, value) => document.execCommand(command, false, value);
const queryCommandValue = (command) => document.queryCommandValue(command);

export default {
	props: {
		value: { type: String, default: "" },
	},
	mounted() {
		this.$el.innerHTML = this.value;
	},
	watch: {
		value(newValue) {
			if (this.$el.innerHTML !== newValue) this.$el.innerHTML = newValue;
		},
	},
	methods: {
		handleInput(e) {
			const { firstChild } = e.target;
			if (firstChild && firstChild.nodeType === 3) exec("formatBlock", "span");
			else if (this.$el.innerHTML === "<br>") this.$el.innerHTML = "";
			this.$emit("input", this.$el.innerHTML);
		},
		handleDelayedInput(e) {
			this.$nextTick(() => this.handleInput(e));
		},
		handleKeydown(e) {
			if (
				e.key.toLowerCase() === "enter" &&
				queryCommandValue("formatBlock") === "blockquote"
			) {
				this.$nextTick(() => exec("formatBlock", "span"));
			}
		},
	},
};
</script>
