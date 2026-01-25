import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { fetchWeb } from "./apiUtils";
import { AppError } from "../utils/AppError";

const KEYBO_JSON_PATH = path.resolve("./server/kyobo.json");

export async function getKyoboBookInfoByIsbn(isbn: string) {
    try {
        const kyoboJson = JSON.parse(fs.readFileSync(KEYBO_JSON_PATH, "utf-8"));

        if (kyoboJson.hasOwnProperty(isbn)) {
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
    } catch (error) {
        console.error(`Fail to process Kyobo data: ${error}`);
        throw new AppError("Failed to get Kyobo book information", 500);
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
        .map((index, element: any) => {
            return {
                prodType: $(element).find(".prod_type").text().trim(),
                prodPrice: $(element).find(".prod_price").text().trim(),
                href: $(element).attr("href"),
            };
        })
        .get();
}
