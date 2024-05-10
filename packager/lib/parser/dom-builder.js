import { Attributes, TesseraTagNode, TesseraTextNode, ParserAttributeError } from "./tree-objects";
import { ParserError } from "./errors";
import { Utils } from "./uitls";
import { CssBuilder } from "./css-js-file-builder";
class DomBuilder {
    htmlString;
    tree;
    cursorPosition = 0;
    htmlId;
    static dispatch = {
        undefined: (_htmlDom, _groups, _len) => { },
        comment: DomBuilder.processSkip,
        doctype: DomBuilder.processSkip,
        open: DomBuilder.processOpenTag,
        close: DomBuilder.processCloseTag
    };
    cssBuilder = new CssBuilder();
    nodes;
    constructor(htmlString, htmlId) {
        this.htmlString = htmlString.trim();
        this.htmlId = htmlId;
        this.nodes = [];
    }
    static processOpenTag(htmlDom, groups, len, htmlStr) {
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
            if (node.isSelfClosing)
                htmlDom.popCompletedNode();
            htmlDom.cursorPosition += len;
        }
        catch (e) {
            if (e instanceof ParserAttributeError)
                throw new ParserError(`${e.message} in tag <${tagName} ${attributesString} ${(isSelfClosing) ? "/" : ""}>`);
            else
                throw e;
        }
    }
    static processCloseTag(htmlDom, groups, len, _html) {
        let closingTagName = groups["c_name"];
        if (htmlDom.nodes.length === 0)
            throw new ParserError(`Closing tag </${closingTagName}> without any open tags`);
        let openingTag = htmlDom.nodes[htmlDom.nodes.length - 1];
        if (closingTagName !== openingTag.tagName) {
            throw new ParserError(`Mismatching closing and opening tags <${openingTag.tagName} ${openingTag.attributes?.toString()}> -></${closingTagName}>`);
        }
        htmlDom.popCompletedNode();
        htmlDom.cursorPosition += len;
    }
    static processSkip(htmlDom, _, len, _html) {
        htmlDom.cursorPosition += len;
    }
    pushNewTextNode(match) {
        if (match.index === this.cursorPosition)
            return;
        if (this.nodes.length < 1) {
            throw new ParserError(`Template missing container tag, at 
                ${this.htmlString.substring(this.cursorPosition, (this.htmlString.length - 1 > 40) ? 40 : this.htmlString.length - 1)}`);
        }
        let node = new TesseraTextNode({
            text: this.htmlString.substring(this.cursorPosition, match.index)
        });
        this.nodes[this.nodes.length - 1].children.push(node);
        this.cursorPosition += node.text.length;
    }
    popCompletedNode() {
        let node = this.nodes.pop();
        if (this.cssBuilder.captureTags.has(node.tagName)) {
            this.cssBuilder.prependTags({ file: this.htmlId, tree: node });
            return;
        }
        if (this.nodes.length == 0)
            this.tree = node;
        else
            this.nodes[this.nodes.length - 1].children.push(node);
    }
    processTags() {
        let groupNameMap = new Set(Object.keys(DomBuilder.dispatch));
        groupNameMap.delete("undefined");
        for (let tagMatches of this.htmlString.matchAll(Utils.regExp.htmltags)) {
            let groups = tagMatches.groups;
            this.pushNewTextNode(tagMatches);
            for (let tagGroupName of groupNameMap) {
                DomBuilder.dispatch[(groups[tagGroupName]) ? tagGroupName : "undefined"](this, groups, tagMatches[0].length, tagMatches[0]);
            }
        }
    }
    build() {
        if (Utils.isNullOrUndefined(this.tree))
            this.processTags();
        if (Utils.isNullOrUndefined(this.tree?.attributes))
            this.tree.attributes = Attributes.create(`id=${this.htmlId}`);
        else
            this.tree?.attributes?.set("id", this.htmlId);
        return this.tree;
    }
    getCss() {
        return this.cssBuilder.outputToString();
    }
    getHtml() {
        return this.build()?.render() || "";
    }
}
export { DomBuilder };
