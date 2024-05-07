import { Attributes, TesseraTagNode, TesseraTextNode, ParserAttributeError, Groups } from "./tree-objects";
import { ParserError } from "./errors";
import { Utils } from "./uitls";
import EventEmitter from "events";


class DomBuilder {

    private htmlString: string;
    private _tree: TesseraTagNode | undefined;
    private cursorPosition: number = 0;
    private htmlId: string;
    public static eventEmitter: EventEmitter = new EventEmitter();
    private static dispatchGroupNames: Set<string>;
    private static dispatch: {[key: string]: (htmlDom: DomBuilder, groups: Groups, len: number) => void} = {
        undefined: (_htmlDom: DomBuilder, _groups: Groups, _len: number) => {},
        comment: DomBuilder.processSkip,
        doctype: DomBuilder.processSkip,
        open: DomBuilder.processOpenTag,
        close: DomBuilder.processCloseTag
    };

    static {
        this.dispatchGroupNames = new Set<string>(Object.keys(DomBuilder.dispatch));
        this.dispatchGroupNames.delete("undefined");
    }
    private nodes: TesseraTagNode[];


    constructor(htmlString: string, htmlId: string) {
        this.htmlString = htmlString.trim();
        this.htmlId = htmlId;
        this.nodes = [];
    }

    private set tree(completedTree: TesseraTagNode) {
        let tagName = completedTree.tagName.toLocaleLowerCase();
        if (DomBuilder.tagEventsMap.has(completedTree.tagName.toLocaleLowerCase())) {
            DomBuilder.eventEmitter.emit(tagName.toLocaleLowerCase(), { file: this.htmlId, tree: completedTree});
        }
        this._tree = completedTree;
    }

    private static readonly tagEventsMap = new Set<string>(["style", "script"]);

    private static processOpenTag(htmlDom: DomBuilder, groups: Groups, len: number) {
        let tagName = groups["o_name"].trim();
        let isSelfClosing = groups["closingBracket"] === "/>" || Utils.SelfClosingTagsWithoutBackSlash.has(tagName);
        let attributesString = groups["attrs"];
        try {
            let node = new TesseraTagNode({
                parent: (htmlDom.nodes.length < 1) ? undefined : htmlDom.nodes[htmlDom.nodes.length - 1],
                tagName,
                isSelfClosing,
                attributes: Attributes.create(attributesString)
            });
            if (!Utils.isNullOrUndefined(node.parent)) node.parent?.children.push(node);
            if (!node.isSelfClosing) htmlDom.nodes.push(node);
            else htmlDom.tree = node
            htmlDom.cursorPosition += len;
        } catch (e) {
            if (e instanceof ParserAttributeError) throw new ParserError(`${e.message} in tag <${tagName} ${attributesString} ${(isSelfClosing) ? "/" : ""}>`);
            else throw e;
        }
    }

    private static processCloseTag(htmlDom: DomBuilder, groups: Groups, len: number) {
        let closingTagName = groups["c_name"];
        if (htmlDom.nodes.length === 0) throw new ParserError(`Closing tag </${closingTagName}> without any open tags`);
        let openingTag = htmlDom.nodes[htmlDom.nodes.length - 1];
        if (closingTagName !== openingTag.tagName) {
            throw new ParserError(
                `Mismatching closing and opening tags <${openingTag.tagName} ${openingTag.attributes?.toString()}> -></${closingTagName}>`
            );
        }
        htmlDom.popNodeToTree();
        htmlDom.cursorPosition += len;
    }

    private static processSkip(htmlDom: DomBuilder, _: Groups, len: number) {
        htmlDom.cursorPosition += len;
    }
    private pushNewTextNode(match: RegExpExecArray) {
        if (match.index === this.cursorPosition) return
        if (this.nodes.length < 1) {
            throw new ParserError(
                `Template missing container tag, at 
                ${this.htmlString.substring(this.cursorPosition, (this.htmlString.length - 1 > 40) ? 40 : this.htmlString.length - 1)}`
            )
        }
        let node = new TesseraTextNode({
            parent: this.nodes[this.nodes.length - 1],
            text: this.htmlString.substring(this.cursorPosition, match.index)
        });
        node.parent.children.push(node);
        this.cursorPosition += node.text.length;
    }

    private popNodeToTree() {
        let tree = this.nodes.pop() as TesseraTagNode;
        if (!Utils.isNullOrUndefined(tree) && tree.tagName == "body") {
            if (Utils.isNullOrUndefined(tree.attributes)) tree.attributes = Attributes.create(`id="${this.htmlId}"`);
            else Object.defineProperty((this._tree as TesseraTagNode).attributes, "id", {value: this.htmlId});
        }
    }

    private processTags() {
        for(let tagMatches of this.htmlString.matchAll(Utils.regExp.htmltags)) {
            let groups = tagMatches.groups as Groups;
            this.pushNewTextNode(tagMatches)
            for(let tagGroupName of DomBuilder.dispatchGroupNames) {
                DomBuilder.dispatch[(groups[tagGroupName]) ? tagGroupName : "undefined"](this, groups, tagMatches[0].length);
            }
        }
    }

    public build(): TesseraTagNode | undefined{
        if (Utils.isNullOrUndefined(this._tree)) this.processTags();
        DomBuilder.eventEmitter.emit("done", {file: this.htmlId, })
        return this._tree;
    }
}

export { DomBuilder };