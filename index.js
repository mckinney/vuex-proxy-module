import VuexProxyModuleController from "./proxy-module";

function createProxyModule(proxy, namespaced = true) {
	return (store) => {
		const proxyController = new VuexProxyModuleController(store, proxy);

		const { commit, dispatch } = store;

		function registerProxyModule() {
			unregisterProxyModule();

			store.registerModule(proxyController.pathArray, {
				namespaced,
				state: proxyController.realModuleState,
				getters: proxyController.realModuleGetters,
			});

			Object.entries(proxyController.realModuleReference._children).forEach(([key, childModule]) => {
				store.registerModule([...proxyController.pathArray, key], childModule._rawModule, {
					preserveState: true
				});
			});
		}

		function unregisterProxyModule() {
			if (store.hasModule(proxyController.pathArray)) {
				store.unregisterModule(proxyController.pathArray);
			}
		}

		store.commit = function wrappedCommit(originalPath, payload) {
			const path = proxyController.parsePath(originalPath, store.state, store.getters);
			return commit(path, payload);
		};

		store.dispatch = function wrappedDispatch(originalPath, payload) {
			const path = proxyController.parsePath(originalPath, store.state, store.getters);
			return dispatch(path, payload);
		};

		store.watch(proxy.proxyPath, (current, previous) => {
			const moduleLocation = typeof current === "string" ? current.split("/") : current;

			if (current && !store.hasModule(moduleLocation)) {
				throw new Error(`vuex-proxy-module expected module at path ${current} to exist`);
			} else if (!current) {
				unregisterProxyModule();
			} else if (current !== previous) {
				registerProxyModule(current);
			}
		});
	};
}

export default createProxyModule;
