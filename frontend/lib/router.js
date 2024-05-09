import { Utils } from "./utils.js";
class Router {
    routes = null;
    routeHistory = [];
    #templatesXml = null;
    static default404 = {
        title: "404 Not Found",
        template: "default-404"
    };

    constructor(routes, state = {}) {
        this.routes = routes;
        this.registerState(state);
        let uriHandlerClosure = Router.getRouterBoundUriHandler(this);
        window.addEventListener("hashchange", uriHandlerClosure);
        uriHandlerClosure();
    }
    registerState(state) {
        if (Utils.isNullOrUndefined(window.MosaicState))
            window.MosaicState = {};
        else
            window.MosaicState = { ...window.MosaicState, ...state };
    }
    getRoute() {
        let location = window.location.hash.replace("#", "");
        if (location.length == 0)
            location = "/";
        return this.routes?.[location] || this.routes?.["404"] || Router.default404;
    }

    static getRouterBoundUriHandler(router) {
        return async (e) => {
            if (!Utils.isNullOrUndefined(e)) e.preventDefault();
            if (router.#templatesXml === null) await router.getTemplates();
            let route = router.getRoute();
            router.routeHistory.push(route);
            router.updateHtml(route.template, route.title);
        };
    }
    async getTemplates() {
        let xmlStr = await fetch(`${window.location.origin}/templates.xml`).then((response) => response.text());
        this.#templatesXml = new DOMParser().parseFromString(xmlStr, "text/xml");
    }
    updateHtml(templateId, title) {
        let templateBody = this.#templatesXml.getElementById(templateId);
        let appContainer = document.getElementById("app-container");
        appContainer.innerHTML = "";
        for(let child of templateBody.childNodes) {
            appContainer.appendChild(child);
        }
        document.title = title;
    }
}
export { Router };
