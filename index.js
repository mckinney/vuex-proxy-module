/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-underscore-dangle: ["error",
	{"allow": ["_modulesNamespaceMap", "_children", "_rawModule", "_modules"] }] */

import objectPath from "object-path";
import { installer as hasModuleInstaller } from "vuex-has-module";

function createProxyModule(proxy, namespaced = true) {
	const proxyPathArray = proxy.path.split("/");

	function getProxyRealPath(state, getters) {
		const proxyResult = proxy.proxyCondition(state, getters);

		let realPath = false;

		if (typeof proxy.path === "function") {
			realPath = proxy.paths(proxyResult);
		} else if (typeof proxy.path === "object") {
			realPath = proxy.paths[proxyResult];
		} else  {
			throw new Error("Vuex Proxy module does not recognize the paths option.");
		}

		return realPath;
	}

	function maybeRewriteProxyPath(originalPath, state, getters) {
		let path = originalPath;
		let newPath = originalPath;

		if (path.startsWith(proxy.path)) {
			newPath = getProxyRealPath(state, getters);
			path = originalPath.replace(proxy.path, newPath);
		}

		return path;
	}

	function getProxyState(state, getters) {
		const path = getProxyRealPath(state, getters);
		return objectPath.get(state, path.split("/"));
	}

	return (store) => {
		const { commit, dispatch } = store;

		if (!store.hasModule) {
			store.hasModule = hasModuleInstaller(store);
		}

		function state() {
			return getProxyState(store.state, store.getters);
		}

		function registerProxyModule(activePath) {
			const moduleGetterPathArray = activePath.split("/").reduce((array, path) => [...array, path, "_children"], []);
			moduleGetterPathArray.pop();
			const realModule = objectPath.get(store._modules.root._children, moduleGetterPathArray);

			store.registerModule(proxyPathArray, {
				namespaced,
				state,
				getters: realModule._rawModule.getters,
			});

			Object.entries(realModule._children).forEach(([key, module]) => {
				store.registerModule([...proxyPathArray, key], module._rawModule, { preserveState: true });
			});
		}

		store.commit = function wrappedCommit(originalPath, payload) {
			const path = maybeRewriteProxyPath(originalPath, store.state, store.getters);
			return commit(path, payload);
		};

		store.dispatch = function wrappedDispatch(originalPath, payload) {
			const path = maybeRewriteProxyPath(originalPath, store.state, store.getters);
			return dispatch(path, payload);
		};

		store.watch(getProxyRealPath, (newPath, oldPath) => {
			if (newPath !== oldPath) {
				if (store.hasModule(proxyPathArray)) {
					store.unregisterModule(proxyPathArray);
				}

				if (store.hasModule(newPath)) {
					registerProxyModule(newPath);
				}
			}
		}, { immediate: true });
	};
}

export default createProxyModule;
