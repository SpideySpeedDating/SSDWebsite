class Router {
    static #isInternalConstructor = false;
    static #instance = null;
    static #routes = {
        "/": {
            title: "Home",
            template: "./templates/index.html"
        }
    };
    static #default404 = {
        title: "404 Not Found",
        template: "./templates/404.html"
    }

    constructor() {
        if (!Router.#isInternalConstructor) throw new TypeError("Router is not constructable");
        Router.#isInternalConstructor = false;
    }

    static get Instance() {
        if (Router.#instance === null){
            Router.#isInternalConstructor = true;
            Router.#instance = new Router();
        }
        return Router.#instance;
    }

    static registerRoute() {
        // TODO: Register routes
    }

    static uriHandler() {
        // Assuming we going with a hash location
        var location = window.location.hash.replace("#", "");
        if (location.length == 0) location = "/"
        var route = Router.#routes[location] || Router.#routes["404"] || Router.#default404
        // TODO: Fetch Route Template
        // TODO: Update document 
        /**
         *  We need to know the 'app-container' id before hand so we know where to update the document
         */
        // document.title = route.title
    }

    static run() {
        window.addEventListener("hashchange", Router.uriHandler);
        Router.uriHandler();
    }
}

export default Router