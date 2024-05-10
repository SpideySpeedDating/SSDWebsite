class Utils {
    static regExp = {
        attributes: /((?<key>[\w\d\-\_\:]+)+?=(("|')(?<val>.*?)(\4))\s*)/g,
        htmltags: /((?<doctype><!\s*DOCTYPE\s*html\s*>)|(?<comment><!--(.*?)\s*(.*?)-->)|(?<open><(?<o_name>[A-Za-z0-9]+)(?<attrs>\s+([\w\d\-\_\:]*)=("|').*?\10)*\s*(?<closingBracket>\/?>))|(?<close><\/(?<c_name>[A-Za-z0-9]+)>))(?<whitespace>[\s|\n|\t|\r]*)/g
    };
    static SelfClosingTagsWithoutBackSlash = new Set(["meta", "link"]);
    static isNullOrUndefined(value) {
        return (value === undefined || value === null);
    }
}
export { Utils };
