import { DomBuilder } from "./parser/dom-builder.js";
import path from "path";
import fs from "fs";
class App {
    templateOutputDir = "./frontend";
    cssOutputDir = "./frontend/css";
    inputDir = "./frontend/templates";
    outputHtml = "";
    outputCss = "";
    constructor() { }
    processFiles() {
        let inputDir = this.inputDir;
        let files = fs.readdirSync(inputDir);
        for (let filename of files) {
            if (path.extname(filename) === ".html") {
                console.log(`Building Template: ${filename}`);
                let dmb = new DomBuilder(this.readFile(`${path.join(this.inputDir, filename)}`), filename.split(".")[0]);
                this.outputHtml += `${dmb.getHtml()}\n`;
                this.outputCss = `${this.outputCss.trim()}${dmb.getCss()}\n`;
            }
        }
    }
    readFile(filepath) {
        return fs.readFileSync(filepath, 'utf8');
        ;
    }
    build() {
        this.processFiles();
        this.writeToFile();
    }
    writeToFile() {
        fs.writeFileSync(path.join(this.templateOutputDir, "templates.xml"), `<templates>\n${this.outputHtml}</templates>`);
        fs.writeFileSync(path.join(this.cssOutputDir, "stylespack.css"), this.outputCss.trim());
    }
}
let app = new App();
app.build();
