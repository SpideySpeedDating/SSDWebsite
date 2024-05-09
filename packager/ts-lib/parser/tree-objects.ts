import { ParserError } from "./errors";
import { Utils } from "./uitls";

interface TesseraNodeInterface<T> {
    children?: Array<T>,
}

abstract class TesseraNodeBase<T> implements TesseraNodeInterface<T> {
    public abstract readonly children: Array<T>;
    public abstract readonly isSelfClosing: boolean;
}

class TesseraTextNode extends TesseraNodeBase<string> {
    override readonly children; 
    public override readonly isSelfClosing: boolean;

    constructor({
        text
    }: TesseraTextNodeOptions) {
        super();
        this.children = [text];
        this.isSelfClosing = true;
    }
    get text(): string {
        return this.children[0];
    }
}

interface TesseraTextNodeOptions extends TesseraNodeInterface<string> {
    text: string
}

class ParserAttributeError extends ParserError {
    constructor(message: string) {
        super(message);
    }
}
class Attributes {

    private _attributes: {[key: string] : string } = {}

    private constructor(attrString: string) {
        let attrs = attrString.matchAll(Utils.regExp.attributes) || [];
        for(var results of attrs) {
            let groups = (results.groups as {[key: string] : string});
            if (Utils.isNullOrUndefined(groups["key"]) || Utils.isNullOrUndefined(groups["val"])) 
                throw new ParserAttributeError(`Invalid attribute string: ${attrString}`);
            this._attributes[groups["key"]] = groups["val"]
        };
    }

    public toString(): string {
        let output = ""; 
        for (let keyVal of Object.entries(this._attributes)) {
            output += `${keyVal[0]}="${keyVal[1]}" `;
        }
        return output.trim();
    }

    public set(key: string, val: string) {
        this._attributes[key] = val;
    }

    public static create(attrsString: string | undefined): Attributes | undefined {
        if (Utils.isNullOrUndefined(attrsString)) return undefined;
        return new Attributes(attrsString as string);
    }
}

type Groups = {[key: string]: string};


class TesseraTagNode extends TesseraNodeBase<TesseraTagNode | TesseraTextNode> {
    public override children: Array<TesseraTagNode | TesseraTextNode>;
    public override isSelfClosing: boolean;
    public attributes: Attributes | undefined;
    public readonly tagName: string;
    public readonly html: string;
    constructor({
        tagName,
        attributes,
        isSelfClosing,
        html,
    }: TesseraTagNodeOptions) {
        super();
        this.children = [];
        this.isSelfClosing = isSelfClosing;
        this.attributes = attributes;
        this.tagName = tagName;
        this.html = html.trim()
    }

    public render(): string {
        let attributeStr = (Utils.isNullOrUndefined(this.attributes)) ? "" : (this.attributes as Attributes).toString();
        let open = `${this.html.replace(Utils.regExp.attributes, "")}`.trim();
        let endBracket = this.isSelfClosing ? "/>" : ">"
        open = `${open.replace(endBracket, ((attributeStr === "") ? "" : " " + attributeStr) + endBracket)}`
        let inner = "";
        for(let child of this.children) {
            inner += (child instanceof TesseraTextNode) ? child.text.replace("&", "&amp;") : child.render();
        };
        if (this.tagName === "textarea" && inner === "") inner = " ";
        let close = `${(this.isSelfClosing ? "" : "</"+this.tagName+">")}`;
        return `${open}${inner}${close}`;
    }
}

interface TesseraTagNodeOptions extends TesseraNodeInterface<TesseraTagNode | TesseraTextNode> {
    tagName: string,
    attributes: Attributes | undefined,
    isSelfClosing: boolean,
    html: string
}

interface TagData { file: string, tree: TesseraTagNode };

export { TesseraTextNode, TesseraTagNode, ParserAttributeError, Attributes };
export type { TesseraTextNodeOptions, TesseraTagNodeOptions, Groups, TagData };
