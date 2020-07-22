import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		colors: [
			"#1abc9c",
			"#2ecc71",
			"#3498db",
			"#9b59b6",
			"#34495e",
			"#f1c40f",
			"#e67e22",
			"#e67e22",
			"#e74c3c",
		],
		json: [],
	},
	getters: {
		getJson(state) {
			return JSON.stringify(state.json);
		},
		getColors(state) {
			return state.colors;
		},
	},
	mutations: {
		setJson(state, payload) {
			state.json = payload;
		},
	},
});
