import { Utils } from "./utils.js";
class Router {
    routes = null;
    routeHistory = [];
    static default404 = {
        title: "404 Not Found",
        template: "/templates/default-404.html"
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
            let route = router.getRoute();
            router.routeHistory.push(route);
            router.updateHtml(await router.getTemplateHtml(route.template), route.title);
        };
    }
    async getTemplateHtml(templatePath) {
        return await fetch(`${window.location.origin}${templatePath}`).then((response) => response.text());
    }
    mountStyleTag() {
    }
    mountScriptTag() {
    }
    updateHtml(innerHtml, title) {
        let appContainer = document.getElementById("app-container");
        appContainer.innerHTML = innerHtml;
        document.title = title;
    }
}
export { Router };
