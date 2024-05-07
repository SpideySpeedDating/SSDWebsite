import { DomBuilder } from "./dom-builder";
import { TagEventData, TesseraTextNode } from "./tree-objects";
import { Utils } from "./uitls";

class CssBuiler {
    private static styles : { [key: string] : string} = {};

    static {
        DomBuilder.eventEmitter.on("style", CssBuiler.prependStyles);
    }

    public static prependStyles(data: TagEventData) {
        if (Utils.isNullOrUndefined(CssBuiler.styles[data.file])) {
            CssBuiler.styles[data.file] = "";
        }
        for (let childNode of data.tree.children) {
            if (childNode instanceof TesseraTextNode) CssBuiler.styles[data.file] += `${childNode.text}\n`;
        }
    }

    public static outputToFile(outputDir: string) {
        let outputStr = "";
        for (let htmlId of Object.keys(this.styles)) {
            outputStr += `@scope {#${htmlId} ${this.styles[htmlId]}}`;
        }
        console.log(outputStr);
    }
}