import { TagEventData, TesseraTextNode } from "./tree-objects";
import { Utils } from "./uitls";

class CssBuilder {
    private static styles : { [key: string] : string} = {};

    public static prependStyles(data: TagEventData) {
        if (Utils.isNullOrUndefined(CssBuilder.styles[data.file])) {
            CssBuilder.styles[data.file] = "";
        }
        for (let childNode of data.tree.children) {
            if (childNode instanceof TesseraTextNode) CssBuilder.styles[data.file] += `${childNode.text}\n`;
        }
    }

    public static outputToFile(outputDir: string) {
        let outputStr = "";
        for (let htmlId of Object.keys(this.styles)) {
            outputStr += `@scope {#${htmlId} ${this.styles[htmlId]}}`;
        }
        console.log(outputStr.trim());
    }
}

export { CssBuilder }