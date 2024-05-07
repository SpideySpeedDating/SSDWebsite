import { ParserError } from "./errors";
import { Utils } from "./uitls";

interface TesseraNodeInterface<T> {
    children?: Array<T>,
}

abstract class TesseraNodeBase<T> implements TesseraNodeInterface<T> {
    public abstract readonly children: Array<T>;
    public abstract readonly parent?: TesseraTagNode | undefined;
    public abstract readonly isSelfClosing: boolean;
}

class TesseraTextNode extends TesseraNodeBase<string> {
    override readonly children; 
    public override readonly parent: TesseraTagNode;
    public override readonly isSelfClosing: boolean;

    constructor({
        parent,
        text
    }: TesseraTextNodeOptions) {
        super();
        this.parent = parent;
        this.children = [text];
        this.isSelfClosing = true;
    }
    get text(): string {
        return this.children[0];
    }


}

interface TesseraTextNodeOptions extends TesseraNodeInterface<string> {
    parent: TesseraTagNode,
    text: string
}

class ParserAttributeError extends ParserError {
    constructor(message: string) {
        super(message);
    }
}
class Attributes {

    private attrsString: string;

    private constructor(attrString: string) {
        this.attrsString = attrString;
        let attrs = attrString?.matchAll(Utils.regExp.attributes) || [];
        for(var results of attrs) {
            let groups = (results.groups as {[key: string] : string});
            if (Utils.isNullOrUndefined(groups["key"]) || Utils.isNullOrUndefined(groups["val"])) 
                throw new ParserAttributeError(`Invalid attribute string: ${attrString}`);
            Object.defineProperty(this, groups["key"], {value: groups["val"]});
        };
    }

    public toString(): string {
        return this.attrsString;
    }

    public static create(attrsString: string | undefined): Attributes | undefined {
        if (Utils.isNullOrUndefined(attrsString)) return undefined;
        return new Attributes(attrsString as string);
    }
}

type Groups = {[key: string]: string};


class TesseraTagNode extends TesseraNodeBase<TesseraTagNode | TesseraTextNode> {
    public override children: Array<TesseraTagNode | TesseraTextNode>;
    public override parent?: TesseraTagNode | undefined;
    public override isSelfClosing: boolean;
    public attributes: Attributes | undefined;
    public readonly tagName: string;
    constructor({
        parent,
        tagName,
        attributes,
        isSelfClosing
    }: TesseraTagNodeOptions) {
        super();
        this.parent = parent;
        this.children = [];
        this.isSelfClosing = isSelfClosing;
        this.attributes = attributes;
        this.tagName = tagName;
        this.parent = parent;
    }
}

interface TesseraTagNodeOptions extends TesseraNodeInterface<TesseraTagNode | TesseraTextNode> {
    parent: TesseraTagNode | undefined,
    tagName: string,
    attributes: Attributes | undefined,
    isSelfClosing: boolean
}

interface TagEventData { file: string, tree: TesseraTagNode };

export { TesseraTextNode, TesseraTagNode, ParserAttributeError, Attributes };
export type { TesseraTextNodeOptions, TesseraTagNodeOptions, Groups, TagEventData };
