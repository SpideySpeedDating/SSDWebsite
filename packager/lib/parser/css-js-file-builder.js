import { TesseraTextNode } from "./tree-objects.js";
import { Utils } from "./uitls.js";
class LangBuilder {
    prependTags(data) {
        if (Utils.isNullOrUndefined(this.fileTagsMap[data.file]))
            this.fileTagsMap[data.file] = "";
        for (let childNode of data.tree.children) {
            if (childNode instanceof TesseraTextNode) {
                this.fileTagsMap[data.file] += `${childNode.text.replace(/[\s\n\r\t]+/g, " ")}`;
            }
        }
    }
    outputToString() {
        let outputStr = "";
        for (let fileId of Object.keys(this.fileTagsMap)) {
            outputStr += this.getOutputString(fileId);
        }
        return outputStr.trim();
    }
}
class CssBuilder extends LangBuilder {
    constructor() { super(); }
    captureTags = new Set(["link", "style"]);
    fileTagsMap = {};
    getOutputString(fileId) {
        return `@scope ( #${fileId} ) { ${this.fileTagsMap[fileId]} }\n`;
    }
}
export { CssBuilder };
