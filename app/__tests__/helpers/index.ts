import fs from "fs";
import path from "path";

export function readHtmlFile(url: string) {
    const filePath = path.join(__dirname, url);
    return fs.readFileSync(filePath, "utf-8");
}

export function getElementFromHtml(html: string, elementName: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.querySelector(elementName) as HTMLElement | null;
}
