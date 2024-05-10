import { ParserError } from "./errors";
import { Utils } from "./uitls";
class TesseraNodeBase {
}
class TesseraTextNode extends TesseraNodeBase {
    children;
    isSelfClosing;
    constructor({ text }) {
        super();
        this.children = [text];
        this.isSelfClosing = true;
    }
    get text() {
        return this.children[0];
    }
}
class ParserAttributeError extends ParserError {
    constructor(message) {
        super(message);
    }
}
class Attributes {
    _attributes = {};
    constructor(attrString) {
        let attrs = attrString.matchAll(Utils.regExp.attributes) || [];
        for (var results of attrs) {
            let groups = results.groups;
            if (Utils.isNullOrUndefined(groups["key"]) || Utils.isNullOrUndefined(groups["val"]))
                throw new ParserAttributeError(`Invalid attribute string: ${attrString}`);
            this._attributes[groups["key"]] = groups["val"];
        }
        ;
    }
    toString() {
        let output = "";
        for (let keyVal of Object.entries(this._attributes)) {
            output += `${keyVal[0]}="${keyVal[1]}" `;
        }
        return output.trim();
    }
    set(key, val) {
        this._attributes[key] = val;
    }
    static create(attrsString) {
        if (Utils.isNullOrUndefined(attrsString))
            return undefined;
        return new Attributes(attrsString);
    }
}
class TesseraTagNode extends TesseraNodeBase {
    children;
    isSelfClosing;
    attributes;
    tagName;
    html;
    constructor({ tagName, attributes, isSelfClosing, html, }) {
        super();
        this.children = [];
        this.isSelfClosing = isSelfClosing;
        this.attributes = attributes;
        this.tagName = tagName;
        this.html = html.trim();
    }
    render() {
        let attributeStr = (Utils.isNullOrUndefined(this.attributes)) ? "" : this.attributes.toString();
        let open = `${this.html.replace(Utils.regExp.attributes, "")}`.trim();
        let endBracket = this.isSelfClosing ? "/>" : ">";
        open = `${open.replace(endBracket, ((attributeStr === "") ? "" : " " + attributeStr) + endBracket)}`;
        let inner = "";
        for (let child of this.children) {
            inner += (child instanceof TesseraTextNode) ? child.text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;") : child.render();
        }
        ;
        if (this.tagName === "textarea" && inner === "")
            inner = " ";
        let close = `${(this.isSelfClosing ? "" : "</" + this.tagName + ">")}`;
        return `${open}${inner}${close}`;
    }
}
;
export { TesseraTextNode, TesseraTagNode, ParserAttributeError, Attributes };
