# frontend 구조

## frontend 폴더 구조 - typescript

```
my-app/
│
├── app/ # 프론트엔드 소스 코드 (예: React, Vue, Angular)
| ├── build/ # 프론트엔드 빌드 결과물 (React build 등)
│ ├── public/ # 정적 파일 (index.html, images 등)
│ ├── src/ # 프론트엔드 애플리케이션 소스 코드
│ │ ├── components/ # UI 컴포넌트
│ │ ├── types/ # 타입스크립트 타입 정의 파일
│ │ ├── App.tsx # 메인 애플리케이션 컴포넌트
│ │ └── index.tsx # 엔트리 포인트
│ └── tsconfig.json # 타입스크립트 컴파일러 설정 (클라이언트용)
│
├── server/ # 백엔드 소스 코드 (Node.js/Express 기준)
│ ├── src/ # TypeScript 소스 코드 (.ts 파일)
│ │ ├── config/ # 설정 파일 (데이터베이스 설정, 환경변수 등)
│ │ ├── models/ # 데이터 모델 (예: Mongoose 모델 등)
│ │ ├── routes/ # 라우터 및 API 엔드포인트 정의
│ │ ├── services/ # 비즈니스 로직 (옵션)
│ │ ├── app.ts # Express 앱 설정 및 미들웨어
│ │ └── server.ts # 서버 시작 스크립트
│ │
│ ├── dist/ # 컴파일된 JavaScript 코드 (.js 파일)
│ │ ├── config/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── app.js # 컴파일된 Express 앱 설정 및 미들웨어
│ │ └── server.js # 컴파일된 서버 시작 스크립트
│
├── shared/ # 클라이언트와 서버 간 공유 타입 정의

├── .env # 환경 변수
├── .gitignore # Git에서 무시할 파일 목록
├── package.json # 프로젝트 의존성 관리 및 스크립트
├── tsconfig.json # 루트 타입스크립트 컴파일러 설정 (옵션)
└── README.md # 프로젝트 문서화

```

### server/app.ts

```
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// 예시로 든 라우터, 실제로는 프로젝트에 맞는 라우터를 구현해야 합니다.
import exampleRouter from './routes/exampleRouter';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 예시 라우터 사용
app.use('/api/example', exampleRouter);

// 기본 경로
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from TypeScript backend!');
});

export default app;

```

### server/server.ts

```
import app from './app';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
```

-   컴파일된 서버 애플리케이션 실행

```
// 컴파일
tsc

// 실행
node dist/server/server.js
```

tsconfig.json

```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./server/dist",
    "rootDir": "./server/src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["server/src/**/*"]
}
```

### Development 환경

-   목적: 개발자가 애플리케이션을 개발하고 테스트하는 단계입니다.
-   특징
    -   디버깅과 문제 해결을 용이하게 하는 상세한 로그 출력.
    -   소스 맵(source maps) 사용으로, 브라우저에서 원본 소스 코드를 쉽게 디버깅할 수 있습니다.
    -   라이브 리로딩(live reloading) 또는 핫 리로딩(hot reloading) 기능을 통해 코드 변경 시 자동으로 애플리케이션을 재시작하거나 변경 사항을 반영합니다.
    -   보안 설정이 완화될 수 있으나, 실제 데이터와 분리된 개발용 데이터베이스를 사용합니다.

### Production 환경

-   목적: 사용자에게 서비스를 제공하는 운영 단계입니다.
-   특징
    -   성능 최적화를 위해 자바스크립트, CSS 파일 압축 및 번들링.
    -   에러 트래킹 및 모니터링을 위한 도구(예: Sentry, LogRocket) 설정.
    -   보안 강화: HTTPS 설정, 보안 헤더 설정, 데이터베이스 액세스 제한 등.
    -   최소한의 로그 출력: 운영 환경에서는 필수적인 정보만 로깅합니다.
    -   자동화된 백업, 스케일링, 장애 복구 절차를 포함한 인프라 관리.

## 환경별 설정 관리 방법

환경 변수와 구성 파일을 사용하여 개발 및 운영 환경 설정을 관리할 수 있습니다. Node.js 애플리케이션에서는 dotenv 패키지를 사용하여 .env 파일로부터 환경 변수를 로드하는 것이 일반적입니다.

### .env 파일 예시:

-   .env.development: 개발 환경 설정
-   .env.production: 운영 환경 설정

### 환경별 설정 로드

```
// process.env.NODE_ENV 값을 기반으로 적절한 .env 파일 로드
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});
```

package.json

```
"scripts": {
  "start": "NODE_ENV=production node server.js",
  "dev": "NODE_ENV=development nodemon server.js"
}
```
