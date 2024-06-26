import {DomBuilder} from "./parser/dom-builder";
import path from "path";
import fs from "fs";

class App {
    private templateOutputDir: string = "./frontend";
    private cssOutputDir: string = "./frontend/css";
    private inputDir: string = "./frontend/templates";
    private outputHtml: string = "";
    private outputCss: string = "";

    constructor() {}

    private processFiles() {
        let inputDir = this.inputDir as string;
        let files = fs.readdirSync(inputDir);
        for(let filename of files) {
            if (path.extname(filename) === ".html") {
                console.log(`Building Template: ${filename}`);
                let dmb = new DomBuilder(
                    this.readFile(`${path.join(this.inputDir as string, filename)}`), filename.split(".")[0]);
                this.outputHtml += `${dmb.getHtml()}\n`;
                this.outputCss = `${this.outputCss.trim()}${dmb.getCss()}\n`;
            }
        }
    }

    private readFile(filepath: string): string {
        return fs.readFileSync(filepath, 'utf8');;
    }

    public build() {
        this.processFiles();
        this.writeToFile();
    }

    private writeToFile() {
        fs.writeFileSync(path.join(this.templateOutputDir, "templates.xml"), `<templates>\n${this.outputHtml}</templates>`);
        fs.writeFileSync(path.join(this.cssOutputDir, "stylespack.css"), this.outputCss.trim());
    }
}

let app = new App();
app.build();
