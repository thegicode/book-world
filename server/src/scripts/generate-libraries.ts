import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });
dotenv.config({ path: path.join(__dirname, "../../../server/.env.key") });

const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY as string;
const API_FORMAT = "json";

const parseURL = (apiPath: string, params: Record<string, string>) => {
    const queryParams = new URLSearchParams({
        ...params,
        authKey: AUTH_KEY,
        format: API_FORMAT,
    });
    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};

const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
};

const fetchAllLibraries = async () => {
    try {
        console.log("Fetching total number of libraries...");
        const url = parseURL("libSrch", { pageNo: "1", pageSize: "1" });
        const data = await fetchData(url);
        
        if (!data.response) {
            throw new Error("Invalid API response");
        }

        const totalLibraries = data.response.numFound;
        console.log(`Total libraries found: ${totalLibraries}`);

        console.log("Fetching all libraries...");
        const allUrl = parseURL("libSrch", { pageNo: "1", pageSize: String(totalLibraries) });
        const allData = await fetchData(allUrl);

        if (!allData.response || !allData.response.libs) {
            throw new Error("Failed to fetch all libraries");
        }

        const libraries = allData.response.libs.map((item: any) => item.lib);
        console.log(`Fetched ${libraries.length} libraries.`);

        const outputDir = path.join(__dirname, "../../data");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePath = path.join(outputDir, "libraries.json");
        fs.writeFileSync(filePath, JSON.stringify(libraries, null, 2));
        console.log(`Saved libraries to ${filePath}`);

    } catch (error) {
        console.error("Error generating libraries cache:", error);
    }
};

fetchAllLibraries();
