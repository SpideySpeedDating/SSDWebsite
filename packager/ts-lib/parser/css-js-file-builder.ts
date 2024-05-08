import { TagData, TesseraTextNode } from "./tree-objects";
import { Utils } from "./uitls";

type FileTagsMap = { [key: string] : string};

abstract class LangBuilder {
    public abstract readonly captureTags: Set<string>;
    abstract fileTagsMap: FileTagsMap;
    public abstract getOutputString(fileId: string): string;

    public prependTags(data: TagData) {
        if(Utils.isNullOrUndefined(this.fileTagsMap[data.file])) this.fileTagsMap[data.file] = "";
        for (let childNode of data.tree.children) {
            if (childNode instanceof TesseraTextNode) {
                this.fileTagsMap[data.file] += `${childNode.text.replace(/[\s\n\r\t]+/g, " ")}`;
            }
        }
    }

    public outputToFile(outputDir: string, styleId: string) {
        let outputStr = "";
        for (let fileId of Object.keys(this.fileTagsMap)) {
            outputStr + this.getOutputString(fileId);
        }
        console.log(outputStr.trim());
    }
}

class CssBuilderSingleton extends LangBuilder {
    private constructor() { super(); }
    public static Instance: CssBuilderSingleton  = new CssBuilderSingleton();
    public override readonly captureTags = new Set<string>(["link", "style"]);
    override fileTagsMap: { [key: string] : string} = {};
    public override getOutputString(fileId: string): string {
        return `@scope ( #${fileId} ) { ${this.fileTagsMap[fileId]} }\n`;    
    }
}

class JsBuilderSingleton extends LangBuilder {
    private constructor() { super(); }
    public static Instance: CssBuilderSingleton  = new JsBuilderSingleton();
    public override readonly captureTags = new Set<string>(["script", "style"]);
    override fileTagsMap: { [key: string] : string} = {};
    public override getOutputString(fileId: string): string {
        return `(()=>{ ${this.fileTagsMap[fileId]}})()\n`;    
    }
}

export { CssBuilderSingleton, JsBuilderSingleton }