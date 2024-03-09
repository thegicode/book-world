# 프로젝트 구조

my-app/
│
├── client/ # 프론트엔드 코드
│ ├── public/ # 정적 파일 (HTML, images 등)
│ ├── src/ # 소스 코드
│ │ ├── components/ # Custom Elements 등
│ │ ├── pages/ # 페이지별 JS 파일 (about, order 등)
│ │ │ ├── about.ts
│ │ │ ├── order.ts
│ │ │ └── ...
│ │ ├── utils/ # 유틸리티 함수 등
│ │ └── index.ts # 엔트리 포인트
│ ├── esbuild.config.js # esbuild 설정 파일
│ └── tsconfig.json # TypeScript 설정
│
├── server/ # 백엔드 코드
│ ├── src/ # 백엔드 소스 코드
│ │ ├── api/ # API 라우트
│ │ ├── config/ # 설정 파일
│ │ └── server.ts # 서버 시작 스크립트
│ └── tsconfig.json # TypeScript 설정
│
├── .env.development # 개발 환경 변수
├── .env.production # 운영 환경 변수
├── package.json # 프로젝트 의존성 및 스크립트
└── README.md # 프로젝트 설명

# esbuild.config.js

```
const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

// 페이지별 엔트리 포인트 정의
const entryPoints = ['about', 'order'].map(page => path.resolve(__dirname, `./src/pages/${page}.ts`));

esbuild.build({
  entryPoints: entryPoints,
  outdir: path.join(__dirname, '/dist'),
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
}).catch(() => process.exit(1));

```

```
const esbuild = require('esbuild');
const sassPlugin = require('esbuild-plugin-sass');
const glob = require('glob');

const isProduction = process.env.NODE_ENV === 'production';

const entryPoints = glob.sync('client/src/pages/**/index.ts');

esbuild.build({
  entryPoints: entryPoints,
  outdir: 'dist',
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: ['es2017'],
  plugins: [sassPlugin()],
}).catch(() => process.exit(1));

```

# package.json

```
"scripts": {
  "dev": "NODE_ENV=development nodemon server/src/server.ts --watch server/src --exec ts-node server/src/server.ts",
  "build:client": "NODE_ENV=production node client/esbuild.config.js",
  "build:server": "tsc -p server/tsconfig.json",
  "build": "npm run build:client && npm run build:server",
  "start": "NODE_ENV=production node server/dist/server.js"
}

```

-   dev: 개발 모드에서 백엔드 서버를 실행합니다.
-   build:client: 프론트엔드 코드를 빌드합니다.
-   build:server: 백엔드 TypeScript 코드를 JavaScript로 컴파일합니다.
-   build: 프론트엔드와 백엔드 모두를 빌드합니다.
-   start: 운영 환경에서 백엔드 서버를 실행합니다.

```
"scripts": {
  "minify-html": "html-minifier --input-dir client/public --output-dir dist --collapse-whitespace --remove-comments"
}

```

```
"scripts": {
  "dev": "NODE_ENV=development nodemon server/src/server.ts --watch server",
  "build": "NODE_ENV=production node client/esbuild.config.js && npm run minify-html",
  "start": "NODE_ENV=production node server/dist/server.js"
}

```

# 다시 질문할 것

frontend 의 개발 환경 세팅 추천

-   프론트엔드를 위한 백엔드 포함
-   development, production 고려
-   typescript
-   vanilaJS
-   esbuild
-   페이지별 bundle(pages > about, order, cart, products, sites ...)
-   페이지별 html page, 자동 minify, watch 적용
