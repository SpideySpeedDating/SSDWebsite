import { Utils } from "./utils.js";

class Router {
    #routes = null;
    #routeHistory = [];

    static #default404 = {
        title: "404 Not Found",
        template: "/lib/templates/404.html"
    }

    constructor(routes, state={}) {
        this.#routes = routes;
        this.registerState(state);
    }

    registerState(state) {
        if (Utils.isNullOrUndefined(window.state)) window.state = {}
        else window.state = {...window.state, ...state}
    }

    async uriHandler() {
        // Assuming we going with a hash location
        console.log(window.location);
        var location = window.location.hash.replace("#", "");
        if (location.length == 0) location = "/"
        var route = this.#routes[location] || this.#routes["404"] || Router.#default404
        this.updateHtml(await this.getTemplateHtml(route.template), route.title);
    }

    async getTemplateHtml(templatePath) {
        return await fetch(`${window.location.origin}/frontend${templatePath}`).then((response) => response.text());;
    }

    mountStyleTag() {

    }

    mountScriptTag() {

    }

    updateHtml(innerHtml, title) {
        document.getElementById("app-container").innerHTML = innerHtml;
        document.title = title;
    }

    async run() {
        window.addEventListener("hashchange", this.uriHandler);
        await this.uriHandler();
    }
}

export{ Router };