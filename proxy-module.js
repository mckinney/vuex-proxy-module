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
		return this.proxyPath(this.store.state, this.store.getters);
	}

	get realModulePathArray() {
		return this.realModulePathString.split("/");
	}

	get realModuleReference() {
		return this.store._modulesNamespaceMap[this.realModulePathString.replace(/\/?$/, '/')];
	}

	get rawRealModule() {
		return this.realModuleReference._rawModule;
	}

	get realModuleState() {
		return objectPath.get(this.store.state, this.realModulePathArray);
	}

	get realModuleGetters() {
		return this.rawRealModule.getters || {};
	}
}

export default VuexProxyModuleController;
