<template>
	<button class="button" v-on="$listeners" v-bind="$attrs">
		<slot></slot>
	</button>
</template>
