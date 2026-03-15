import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export const generateCriticalCss = async () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const BASE_PATH = isProduction ? 'app/build' : 'app/public';
    const ENV_NAME = isProduction ? 'Production' : 'Development';
    const isCriticalCssEnabled = process.env.ENABLE_CRITICAL_CSS === 'true';

    if (!isProduction) {
        console.log('Skipping critical CSS generation in development mode.');
        return;
    }

    if (!isCriticalCssEnabled) {
        console.log('Skipping critical CSS generation. Set ENABLE_CRITICAL_CSS=true to enable it.');
        return;
    }

    let generate: ((options: Record<string, unknown>) => Promise<{ html?: string }>) | undefined;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        ({ generate } = require('critical'));
    } catch (error) {
        console.warn('Failed to load critical CSS generator. Skipping.', error);
        return;
    }

    if (!generate) {
        console.warn('Critical CSS generator is unavailable. Skipping.');
        return;
    }

    console.log(`--- Generating Critical CSS for ${ENV_NAME} ---`);

    const htmlFiles = await getHtmlFiles(BASE_PATH);

    if (htmlFiles.length === 0) {
        throw new Error(`No HTML files found in ${path.join(BASE_PATH, 'html')}. Please run the build for HTML and CSS first.`);
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
                penthouse: {
                    puppeteer: {
                        args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    },
                },
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

const getHtmlFiles = async (BASE_PATH: string) => {
    const htmlDirPath = path.join(BASE_PATH, 'html');
    const files = await glob('**/*.html', { cwd: htmlDirPath });
    return files.filter(file => !file.startsWith('templates/'));
};

if (require.main === module) {
    generateCriticalCss().catch(() => process.exit(1));
}
