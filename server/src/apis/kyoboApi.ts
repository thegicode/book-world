import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { fetchWeb } from "./apiUtils";

const KEYBO_JSON_PATH = path.resolve("./server/kyobo.json");

export async function fetchKyoboBookInfo(req: Request, res: Response) {
    try {
        const bookIsbn = req.query.isbn as string;
        const kyoboJson = JSON.parse(fs.readFileSync(KEYBO_JSON_PATH, "utf-8"));

        if (kyoboJson.hasOwnProperty(bookIsbn)) {
            res.send(kyoboJson[bookIsbn]);
        } else {
            console.log("writeFile", bookIsbn);

            const href = await getAnchorHref(req.query.isbn as string);
            if (!href) return;

            const bookData = await getKyoboInfoData(href);

            kyoboJson[bookIsbn] = bookData;
            fs.writeFileSync(KEYBO_JSON_PATH, JSON.stringify(kyoboJson));

            res.send(bookData);
        }
    } catch (error) {
        console.error(`Fail to read file, ${error}`);
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
