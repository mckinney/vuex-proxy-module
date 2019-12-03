# Vuex Has Module

Vuex plugin for proxying an existing module with a simple path.

## Getting Started

Import the plugin and add it to the root Vuex Store instance.  Use the proxyPath method to return the path of the real module you would like to proxy.  Returning `false` will deactivate the proxy module.


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
			proxyPath: (rootState, rootGetters) => {
				const user = rootGetters["game/players/active"];
				return `game/chapters/${active.id}`;
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