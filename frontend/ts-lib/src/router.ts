import { Utils } from "./utils";
import { Dictionary } from "./types";

type Route = {
    title: string,
    template: string;
}

class Router {
    private routes: Dictionary<Route> | null = null;
    private routeHistory: Route[] = [];

    private static default404 : Route = {
        title: "404 Not Found",
        template: "/templates/default-404.html"
    };

    constructor(routes : Dictionary<Route>, state={}) {
        this.routes = routes;
        this.registerState(state);
    }

    registerState(state: object) {
        if (Utils.isNullOrUndefined(window.MosaicState)) window.MosaicState = {}
        else window.MosaicState = {...window.MosaicState, ...state}
    }

    getRoute(): Route {
        let location = window.location.hash.replace("#", "");
        if (location.length == 0) location = "/";
        return this.routes?.[location] || this.routes?.["404"] || Router.default404;
    }

    async uriHandler() {
        let route = this.getRoute();
        this.routeHistory.push(route);
        this.updateHtml(await this.getTemplateHtml(route.template), route.title);
    }

    async getTemplateHtml(templatePath: string): Promise<string> {
        return await fetch(`${window.location.origin}/frontend${templatePath}`).then((response) => response.text());
    }

    mountStyleTag() {
        
    }

    mountScriptTag() {
        
    }

    updateHtml(innerHtml: string, title: string) {
        let appContainer = document.getElementById("app-container") as HTMLElement;
        appContainer.innerHTML = innerHtml;
        document.title = title;
    }

    async run() {
        window.addEventListener("hashchange", this.uriHandler);
        await this.uriHandler();
    }
}

export{ Router, Route };