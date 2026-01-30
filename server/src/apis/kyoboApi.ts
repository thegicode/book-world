import fs from "fs";
import path from "path";
import cheerio, { Element } from "cheerio";
import { fetchWeb } from "./apiUtils";
import { KyoboApiError } from '../errors/apiErrors';

const KEYBO_JSON_PATH = path.resolve("./server/kyobo.json");

export async function getKyoboBookInfoByIsbn(isbn: string) {
    try {
        const kyoboJson = JSON.parse(fs.readFileSync(KEYBO_JSON_PATH, "utf-8"));

        if (Object.prototype.hasOwnProperty.call(kyoboJson, isbn)) {
            return kyoboJson[isbn];
        } else {
            console.log("writeFile", isbn);

            const href = await getAnchorHref(isbn);
            if (!href) {
                // If no link is found, it's a valid "not found" case, return empty.
                return [];
            }

            const bookData = await getKyoboInfoData(href);

            kyoboJson[isbn] = bookData;
            // Write with indentation for readability
            fs.writeFileSync(KEYBO_JSON_PATH, JSON.stringify(kyoboJson, null, 4));

            return bookData;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Fail to process Kyobo data: ${errorMessage}`);
        // Create a more specific error, preserving the original message
        throw new KyoboApiError(500, `Failed to get Kyobo book information: ${errorMessage}`);
    }
}

async function getAnchorHref(isbn: string) {
    const bookContentPage = await fetchWeb(
        `https://search.kyobobook.co.kr/search?keyword=${isbn}`
    );
    const $ = cheerio.load(bookContentPage);
    return $(".prod_link").attr("href");
}

async function getKyoboInfoData(url: string) {
    const webPageContent = await fetchWeb(url);
    const $ = cheerio.load(webPageContent);

    return $(".btn_prod_type")
        .map((index, element: Element) => {
            return {
                prodType: $(element).find(".prod_type").text().trim(),
                prodPrice: $(element).find(".prod_price").text().trim(),
                href: $(element).attr("href"),
            };
        })
        .get();
}
