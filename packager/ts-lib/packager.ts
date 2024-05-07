import * as fs from "fs";
import * as path from "path";

class MosaicPackager {
    private templateFolderDir: string;
    constructor(templateFolderDir: string) {
        this.templateFolderDir = templateFolderDir;
    }

    private static getAbsolutePath(filepath: string): string {
        return path.resolve(filepath);
    }
}