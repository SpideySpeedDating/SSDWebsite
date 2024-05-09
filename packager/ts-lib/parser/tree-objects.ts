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

    private constructor(attrString: string) {
        let attrs = attrString.matchAll(Utils.regExp.attributes) || [];
        for(var results of attrs) {
            let groups = (results.groups as {[key: string] : string});
            if (Utils.isNullOrUndefined(groups["key"]) || Utils.isNullOrUndefined(groups["val"])) 
                throw new ParserAttributeError(`Invalid attribute string: ${attrString}`);
            Object.defineProperty(this, groups["key"], {value: groups["val"]});
        };
    }

    public toString(): string {
        let output = ""; 
        for (let keyVal of Object.entries(this)) {
            output += `${keyVal[0]}="${keyVal[1]}" `;
        }
        return output;
    }

    public set(key: string, val: string) {
        Object.defineProperty(this, key, {value: val});
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
        let open = `${this.html}`;
        let inner = "";
        if (this.children.length > 0) {
            for(let child of this.children) {
                inner += (child instanceof TesseraTextNode) ? child.text : child.render();
            };
        } 
        let close = `${(this.isSelfClosing ? "" : "</"+this.tagName+">")}`;
        return `${open} ${inner} ${close}`;
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
