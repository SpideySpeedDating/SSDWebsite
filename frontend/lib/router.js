class Router {
    #routes = null;

    static #default404 = {
        title: "404 Not Found",
        template: "./templates/404.html"
    }

    constructor(routes, state={}) {
        this.#routes = routes;
        this.registerState(state);
    }

    registerState(state) {
        if (window.state === undefined || window.state === null ) window.state = {}
        else window.state = {...window.state, ...state}
    }

    uriHandler() {
        // Assuming we going with a hash location
        var location = window.location.hash.replace("#", "");
        if (location.length == 0) location = "/"
        var route = this.#routes[location] || this.#routes["404"] || Router.#default404
        this.updateHtml(this.getTemplateHtml(route.template, route.title));
    }

    getTemplateHtml(templatePath){
        // TODO: Fetch Route Template
        return "";
    }

    updateHtml(innerHtml, title){
        document.getElementById("app-container").innerHTML = innerHtml;
        document.title = title;
    }

    run() {
        window.addEventListener("hashchange", this.uriHandler);
        this.uriHandler();
    }
}

export default Router