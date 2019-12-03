import objectPath from "object-path";

class VuexProxyModuleController {
	constructor(store, proxy) {
		this.store = store;
		this.path = proxy.path;
		this.pathArray = proxy.path.split("/");
		this.proxyPath = proxy.proxyPath;
	}

	parsePath(pathToParse) {
		let path = pathToParse;

		if (pathToParse.startsWith(this.path)) {
			path = pathToParse.replace(this.path, this.realModulePathString);
		}

		return path;
	}

	get realModulePathString() {
		return this.proxyPath(this.store.state, this.store.getters).replace(/\/?$/, '/');
	}

	get realModulePathArray() {
		return this.realModulePathString.split("/");
	}

	get realModuleReference() {
		return this.store._modulesNamespaceMap[this.realModulePathString];
	}

	get rawRealModule() {
		return this.store._modulesNamespaceMap[this.realModulePathString]._rawModule;
	}

	get realModuleState() {
		return objectPath.get(this.store.state, this.realModulePathString.split("/"));
	}

	get realModuleGetters() {
		return this.rawRealModule.getters || {};
	}
}

export default VuexProxyModuleController;
