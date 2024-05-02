import { Utils } from "./utils";
import { Dictionary, HtmlInner } from "./types";

class Renderer {

    constructor() {}
    static createElement(elementName: string, attributes: Dictionary<string>, content: HtmlInner[] | HtmlInner): Node | undefined {
        if (Utils.isNullOrUndefined(elementName)) return undefined;
        if (Utils.isNullOrUndefined(content)) content = "";
        if (typeof(attributes) !== "object") throw new TypeError(`attributes ${attributes} must be a javascript object`);
        var element = document.createElement(elementName);
        for(var key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if(!Array.isArray(content)) var inner = [content];
        else var inner = content
        for (var idx = 0; idx < inner.length; idx++) {
            if ("tagName" in (inner[idx] as Node)) element.appendChild(inner[idx] as Node);
            else element.appendChild(document.createTextNode(inner[idx] as string));
        }
        return element;
    }

    static renderTemplate() {

    }

    static render(element: Node) {
        document.body.appendChild(element);
    }
}

export { Renderer };