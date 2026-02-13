/// <reference path="../../../app/src/type.d.ts" />

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_PATH = isProduction ? 'app/build' : 'app/public';
const ENV_NAME = isProduction ? 'Production' : 'Development';

const getHtmlFiles = async () => {
    const htmlDirPath = path.join(BASE_PATH, 'html');
    const files = await glob('**/*.html', { cwd: htmlDirPath });
    return files.filter(file => !file.startsWith('templates/'));
};

const generateCriticalCss = async () => {
    const { generate } = await import('critical');
    console.log(`--- Generating Critical CSS for ${ENV_NAME} ---`);

    const htmlFiles = await getHtmlFiles();

    if (htmlFiles.length === 0) {
        console.error(`Error: No HTML files found in ${path.join(BASE_PATH, 'html')}.`);
        console.error(`Please run the ${ENV_NAME} build for HTML and CSS first.`);
        process.exit(1);
    }

    for (const htmlFile of htmlFiles) {
        const cssFile = htmlFile.replace('.html', '.css');
        const cssPath = path.join(BASE_PATH, 'css', cssFile);
        const htmlPath = path.join(BASE_PATH, 'html', htmlFile);

        if (!fs.existsSync(cssPath)) {
            console.warn(`Warning: CSS file not found for ${htmlFile} at ${cssPath}. Skipping.`);
            continue;
        }

        try {
            const { html: criticalHtml } = await generate({
                inline: true,
                base: `${BASE_PATH}/`,
                src: `html/${htmlFile}`,
                css: [`css/${cssFile}`],
                width: 1300,
                height: 900,
            });

            if (criticalHtml) {
                await fs.writeFile(htmlPath, criticalHtml);
                console.log(`Critical CSS generated and inlined for ${ENV_NAME} version of ${htmlFile}`);
            } else {
                console.error(`Error: critical.generate did not return HTML for ${htmlFile}.`);
            }
        } catch (error) {
            console.error(`Error during critical CSS generation for ${htmlFile}:`, error);
        }
    }
};

generateCriticalCss().catch(error => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});