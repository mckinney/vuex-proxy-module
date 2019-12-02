# Vuex Has Module

Vuex plugin for proxying an existing module with a simple path.

## Getting Started

```
import Vue from 'vue';
import Vuex from 'vuex';
import global from '@/store/global/';
import createProxyModule '/vuex-proxy-module.plugin';

Vue.use(Vuex);

export new Vuex.Store({
	modules: {
		players,
	},
	plugins: [
		createProxyModule({
			path: "players/active",
			proxyCondition: (rootState, rootGetters) => rootGetters["players/activePlayerID"],
			paths: {
				user: "game/players/user",
				computer: "game/players/computer",
			},
		}),
	],
});
```

## Example Usage

```
// players.store.js

export default {
	namespaced: true,
	getters: {
		fullName: (state) => //...
		availableActions: (state) => //...
	},
};

this.$store.getters[`players/active/fullName"];
this.$store.getters[`players/active/availableActions"];
```