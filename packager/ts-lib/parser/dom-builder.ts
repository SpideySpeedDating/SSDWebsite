import { Attributes, TesseraTagNode, TesseraTextNode, ParserAttributeError, Groups } from "./tree-objects";
import { ParserError } from "./errors";
import { Utils } from "./uitls";
import { CssBuilder } from "./css-js-file-builder";


class DomBuilder {

    private htmlString: string;
    private tree: TesseraTagNode | undefined;
    private cursorPosition: number = 0;
    private htmlId: string;
    private static dispatch: {[key: string]: (htmlDom: DomBuilder, groups: Groups, len: number, html: string) => void} = {
        undefined: (_htmlDom: DomBuilder, _groups: Groups, _len: number) => {},
        comment: DomBuilder.processSkip,
        doctype: DomBuilder.processSkip,
        open: DomBuilder.processOpenTag,
        close: DomBuilder.processCloseTag
    };
    private cssBuilder: CssBuilder = new CssBuilder();

    private nodes: TesseraTagNode[];

    constructor(htmlString: string, htmlId: string) {
        this.htmlString = htmlString.trim();
        this.htmlId = htmlId;
        this.nodes = [];
    }

    private static processOpenTag(htmlDom: DomBuilder, groups: Groups, len: number, htmlStr: string) {
        let tagName = groups["o_name"].trim();
        let isSelfClosing = groups["closingBracket"] === "/>" || Utils.SelfClosingTagsWithoutBackSlash.has(tagName);
        let attributesString = groups["open"];
        let html = htmlStr.replace(/[\s\n\r\t]+/g, " ");
        try {
            let node = new TesseraTagNode({
                tagName,
                isSelfClosing,
                attributes: Attributes.create(attributesString),
                html,
            });
            htmlDom.nodes.push(node);
            if (node.isSelfClosing) htmlDom.popCompletedNode()
            htmlDom.cursorPosition += len;
        } catch (e) {
            if (e instanceof ParserAttributeError) throw new ParserError(`${e.message} in tag <${tagName} ${attributesString} ${(isSelfClosing) ? "/" : ""}>`);
            else throw e;
        }
    }

    private static processCloseTag(htmlDom: DomBuilder, groups: Groups, len: number, _html: string) {
        let closingTagName = groups["c_name"];
        if (htmlDom.nodes.length === 0) throw new ParserError(`Closing tag </${closingTagName}> without any open tags`);
        let openingTag = htmlDom.nodes[htmlDom.nodes.length - 1];
        if (closingTagName !== openingTag.tagName) {
            throw new ParserError(
                `Mismatching closing and opening tags <${openingTag.tagName} ${openingTag.attributes?.toString()}> -></${closingTagName}>`
            );
        }
        htmlDom.popCompletedNode();
        htmlDom.cursorPosition += len;
    }

    private static processSkip(htmlDom: DomBuilder, _: Groups, len: number, _html: string) {
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
            text: this.htmlString.substring(this.cursorPosition, match.index)
        });
        this.nodes[this.nodes.length - 1].children.push(node);
        this.cursorPosition += node.text.length;
    }

    private popCompletedNode() {
        let node = (this.nodes.pop() as TesseraTagNode);
        if (this.cssBuilder.captureTags.has(node.tagName)) {
            this.cssBuilder.prependTags({file: this.htmlId, tree: node});
            return;
        }
        if (this.nodes.length == 0) this.tree = node;
        else this.nodes[this.nodes.length - 1].children.push(node);
    }

    private processTags() {
        let groupNameMap = new Set<string>(Object.keys(DomBuilder.dispatch));
        groupNameMap.delete("undefined");
        for(let tagMatches of this.htmlString.matchAll(Utils.regExp.htmltags)) {
            let groups = tagMatches.groups as Groups;
            this.pushNewTextNode(tagMatches)
            for(let tagGroupName of groupNameMap) {
                DomBuilder.dispatch[(groups[tagGroupName]) ? tagGroupName : "undefined"](this, groups, tagMatches[0].length, tagMatches[0]);
            }
        }
    }

    private build(): TesseraTagNode | undefined{
        if (Utils.isNullOrUndefined(this.tree)) this.processTags();
        if (Utils.isNullOrUndefined(this.tree?.attributes)) 
            (this.tree as TesseraTagNode).attributes = Attributes.create(`id=${this.htmlId}`);
        else this.tree?.attributes?.set("id", this.htmlId);
        return this.tree;
    }

    public getCss(): string {
        return this.cssBuilder.outputToString();
    }

    public getHtml(): string {
        return this.build()?.render() || "";
    }
}

export { DomBuilder };