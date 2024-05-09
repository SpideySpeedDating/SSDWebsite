import {DomBuilder} from "./parser/dom-builder";
import { ParserError } from "./parser/errors";
import {Groups} from "./parser/tree-objects";
import { Utils } from "./parser/uitls";
import path from "path";
import fs from "fs";

class App {
    private outputDir: string | undefined = "";
    private inputDir: string | undefined = "";
    private outputHtml: string = "";
    private outputCss: string = "";

    constructor() {
        for (let arg of process.argv) {
            for(let match of arg.matchAll(Utils.regExp.attributes))
            {
                let groups: Groups = (match.groups as Groups);
                if (groups["key"] === "inputDir") this.inputDir = groups["value"]
                if (groups["key"] === "outpuDir") this.outputDir = groups["value"]
            }
        }

        if(Utils.isNullOrUndefined(this.inputDir)) throw new ParserError("No inputDir argument found");
        if(Utils.isNullOrUndefined(this.outputDir)) throw new ParserError("No outputDir argument found");
    }

    private processFiles() {
        let inputDir = this.inputDir as string;
        let files = fs.readdirSync(inputDir);
        for(let filename of files) {
            if (path.extname(filename) === ".html") {
                console.log(filename);
                let dmb = new DomBuilder(
                    this.readFile(`${path.join(this.inputDir as string, filename)}`), filename.split(".")[0]);
                this.outputHtml += `${dmb.getHtml()}\n`;
                this.outputCss += `${dmb.getCss()}\n`;
            }
        }
    }

    private readFile(filepath: string): string {
        let output = fs.readFileSync(filepath, 'utf8');
        console.log(output);
        return output;
    }

    public build() {
        this.processFiles();
        this.writeToFile();
    }

    private writeToFile() {
        fs.writeFileSync(path.join(this.outputDir as string, "templates.xml"), `<templates>\n${this.outputHtml}</templates>`);
        fs.writeFileSync(path.join(this.outputDir as string, "stylespack.css"), this.outputCss);
    }
}

let app = new App();
app.build();
