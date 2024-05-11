import { Utils } from "./utils.js";
class Router {
    routes = null;
    routeHistory = [];
    #templatesXml = null;
    uriHandlerClosure = null;
    #mountedScripts = []
    #scriptsToMount = []
    static default404 = {
        title: "404 Not Found",
        template: "default-404"
    };

    constructor(routes, state = {}) {
        this.routes = routes;
        this.registerState(state);
        this.uriHandlerClosure = Router.getRouterBoundUriHandler(this);
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
            await router.updateHtml(route.template, route.title, route.guarded || false);
        };
    }
    async getTemplates() {
        let xmlStr = await fetch(`${window.location.origin}/templates`).then((response) => response.text());
        this.#templatesXml = new DOMParser().parseFromString(xmlStr, "text/xml");
    }
    static async isValidSession() {
        let jwt = localStorage.getItem("jwt");
        if (!Utils.isNullOrUndefined(jwt)) return false;
        return await fetch(`${Utils.apiURL()}/auth/verify`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": jwt
            }
        }).then((response) => { 
            if(response.status === 401) return false;
            return true; 
        });
    }
    async updateHtml(templateId, title, guarded) {
        this.unmountScripts();
        let sessionValid = await Router.isValidSession();
        if (!guarded || sessionValid) {
            let templateBody = this.#templatesXml.getElementById(templateId);
            for (let child of templateBody.childNodes) {
                if (child.tagName.toLowerCase() === "script") {
                    this.#scriptsToMount.push(
                        { 
                            "content": child.textContent.replaceAll("&amp;","&").replace("&lt;", "<").replace("&gt;", ">"),
                            "type": child.getAttribute("type")
                        }
                    );
                }
            }

            templateBody = new DOMParser().parseFromString(templateBody.innerHTML, "text/html").body;
            let appContainer = document.getElementById("app-container");
            appContainer.innerHTML = "";
            // .appendChild consumes the child from the template body
            for(let idx=0; idx < templateBody.childNodes.length; idx) {
                let child = templateBody.childNodes[idx];
                if (child.tagName.toLowerCase() === "script") {
                    idx++;
                }
                else appContainer.appendChild(child);
            }
            document.title = title;
            this.mountScripts();
        } else {
            Router.loginRedirect(templateId);
        }
    }
    mountScripts() {
        for(let idx=0; idx < this.#scriptsToMount.length; idx++) {
            let script = document.createElement("script");
            script.id = `custom-script-${idx}`;
            if (this.#scriptsToMount[idx].type) {
                script.setAttribute("type", this.#scriptsToMount[idx].type);
            }
            script.appendChild(document.createTextNode(this.#scriptsToMount[idx].content));
            this.#mountedScripts.push(script);
            document.body.appendChild(script);
        }
        this.#scriptsToMount = []
    }
    unmountScripts() {
        for(let script of this.#mountedScripts) {
            document.body.removeChild(script);
        }
        this.#mountedScripts = []
    }
    static loginRedirect(to, indexMessage=null) {
        localStorage.setItem("loginRedirect", to);
        if (!Utils.isNullOrUndefined(indexMessage)) localStorage.setItem(Utils.indexMessage, indexMessage);
        window.location.hash = "#";
    }
    async start() {
        window.addEventListener("hashchange", this.uriHandlerClosure);
        await this.uriHandlerClosure();
    }
}
export { Router };
