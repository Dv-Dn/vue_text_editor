<template>
	<div id="app">
		<header class="header">
			<div class="header__input-block">
				<Input
					class="header__input "
					v-model="fontSize"
					placeholder="Font size"
				/>
				<Btn @click="wrapText('fontSize', fontSize + 'px')">Set font size</Btn>
			</div>
			<div class="header__input-block">
				<Input class="header__input " v-model="color" placeholder="Color" />
				<Btn @click="wrapText('color', color)">Color</Btn>
			</div>
			<div class="header__input-block">
				<Input class="header__input " v-model="bg" placeholder="Bg" />
				<Btn @click="wrapText('backgroundColor', bg)">BG color</Btn>
			</div>

			<Btn @click="jsonToConsole">JSON to console</Btn>
		</header>
		<div
			class="edit-field"
			ref="editField"
			contenteditable
			spellcheck="false"
			@keydown.enter.prevent="handleKeydown"
			@keydown.delete.prevent="onDelete"
		>
			Lorem ipsum, dolor sit amet<br />
			consectetur adipisicing eli<br />t. Harum distinctio, sunt excepturi quis
			minus illo?
		</div>
	</div>
</template>

<script>
import Btn from "@/components/Button";
import Input from "@/components/Input";
import {
	outdent,
	wrapNodeInSpan,
	normalize,
	elNodesToJson,
	joinSpans,
} from "@/utils/utils.js";

export default {
	name: "App",
	components: {
		Btn,
		Input,
	},
	data: () => ({
		fontSize: "",
		color: "",
		bg: "",
	}),
	computed: {
		colors() {
			return this.$store.getters.getColors;
		},
		json() {
			return this.$store.getters.getJson;
		},
	},
	methods: {
		jsonToConsole() {
			this.$store.commit("setJson", elNodesToJson(this.$refs.editField));
		},
		wrapText(attr, value) {
			wrapNodeInSpan(attr, value);
			this.$nextTick(() => {
				normalize(this.$refs.editField);
			});
			this.$nextTick(() => {
				joinSpans(this.$refs.editField);
			});
		},
		handleKeydown() {
			document.execCommand("insertLineBreak");
			outdent(this.$refs.editField);
		},
		onDelete() {
			// e.preventDefault();
			document.execCommand("delete", false, null);
			this.$nextTick(() => {
				joinSpans(this.$refs.editField);
			});
		},
	},
};
</script>

<style lang="scss">
@import "@/styles/main.scss";
</style>
