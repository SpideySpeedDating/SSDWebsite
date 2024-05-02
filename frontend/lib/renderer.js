import { Utils } from "./utils.js";

class Renderer {

    constructor() {}
    static createElement(elementName, attributes, content) {
        if (Utils.isNullOrUndefined(elementName)) return undefined;
        if (Utils.isNullOrUndefined(content)) content = "";
        if (typeof(attributes) !== "object") throw new TypeError(`attributes ${attributes} must be a javascript object`);
        var element = document.createElement(elementName);
        for(var key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if(!Array.isArray(content)) {
            content = [content];
        }
        for (var idx = 0; idx < content.length; idx++) {
            if (content[idx].tagName) inner = content[idx];
            else inner = document.createTextNode(content[idx]);
            element.appendChild(inner);
        }
        return element;
    }

    static render(element) {
        document.body.appendChild(element);
    }
}

export { Renderer };