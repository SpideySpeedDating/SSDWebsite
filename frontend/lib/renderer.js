import { Utils } from "./utils.js";
class Renderer {
    constructor() { }
    static createElement(elementName, attributes, content) {
        if (Utils.isNullOrUndefined(elementName))
            return undefined;
        if (Utils.isNullOrUndefined(content))
            content = "";
        if (typeof (attributes) !== "object")
            throw new TypeError(`attributes ${attributes} must be a javascript object`);
        var element = document.createElement(elementName);
        for (var key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if (!Array.isArray(content))
            var inner = [content];
        else
            var inner = content;
        for (var idx = 0; idx < inner.length; idx++) {
            if ("tagName" in inner[idx])
                element.appendChild(inner[idx]);
            else
                element.appendChild(document.createTextNode(inner[idx]));
        }
        return element;
    }
    static renderTemplate() {
    }
    static render(element) {
        document.body.appendChild(element);
    }
}
export { Renderer };
