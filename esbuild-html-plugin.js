// esbuild-html-plugin.js
const fs = require('fs').promises;

const htmlLoaderPlugin = {
    name: 'html-loader',
    setup(build) {
        // .html 파일 로드 시 실행될 핸들러 설정
        build.onLoad({ filter: /\.html$/ }, async (args) => {
            try {
                // html 파일 내용을 읽어옴
                const htmlContent = await fs.readFile(args.path, 'utf8');

                // 파일 내용을 JSON 문자열로 변환하여 JS 모듈로 만듦
                // (e.g., '<div>...</div>' -> '"<div>...</div>"')
                const escapedContent = JSON.stringify(htmlContent);

                return {
                    // export default "<div>...</div>"; 형태의 JS 코드로 변환
                    contents: `export default ${escapedContent};`,
                    // 이 결과물을 JavaScript로 처리하도록 loader 설정
                    loader: 'js',
                };
            } catch (error) {
                return {
                    errors: [{
                        text: `Failed to load HTML file: ${args.path}`,
                        detail: error.message,
                    }],
                };
            }
        });
    },
};

module.exports = htmlLoaderPlugin;
