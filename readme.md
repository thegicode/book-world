# 📚 Book World

프레임워크 없이 웹 표준 기술로 구현한 고성능 도서 검색 및 관심 도서 관리 애플리케이션입니다.

## 🚀 Key Features

- **도서 검색**: 네이버 API를 통한 정밀 도서 검색 및 상세 정보 제공
- **관심 도서 관리**: 관심 도서를 카테고리별로 분류하고 순서를 지정 (LocalStorage 기반)
- **도서관 연동**: 내 주변 도서관의 소장 여부 및 대출 가능 여부 실시간 확인 (도서관 정보나루 API)
- **성능 최적화**: Critical CSS 인라인화, WebP 이미지 변환, HTML/JS 압축 적용

## 🛠️ Tech Stack & Architecture

- **Frontend**: TypeScript, Web Components (Custom Elements), SCSS, Publisher/Observer Pattern
- **Backend**: Node.js (Express), BFF(Backend For Frontend) Pattern
- **Build**: [esbuild](https://esbuild.github.io/) (Ultra-fast bundler), [Sass](https://sass-lang.com/), [html-minifier-terser](https://github.com/terser/html-minifier-terser)
- **Architecture**:
  - **@/ Alias**: `@/` 별칭을 사용하여 모듈 간 참조 경로 간소화
  - **Unified Build Pipeline**: HTML, CSS, JS, Image 최적화를 하나의 통합 빌드 스크립트(`build-assets.ts`)로 제어
  - **Automated Quality Control**: Husky와 lint-staged를 통해 커밋 전 타입 체크, 린트, 테스트 자동 수행

## ⚙️ 설치 및 실행

1. **환경 변수 설정**
   루트 디렉토리에 `.env` 파일을 생성하고 필요한 API 키를 설정합니다.
   ```bash
   LIBRARY_KEY=YOUR_API_KEY_HERE
   NAVER_CLIENT_ID=YOUR_CLIENT_ID
   NAVER_CLIENT_SECRET=YOUR_CLIENT_SECRET
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run start
   ```

4. **운영 빌드**
   ```bash
   npm run build
   ```

5. **테스트 실행 (Unit Tests)**
   ```bash
   npm test
   ```

## 📂 프로젝트 구조

- `app/src/scripts`: 프론트엔드 소스 코드 (Model-View-Service 구조)
- `app/src/markup`: HTML 마크업 및 템플릿
- `app/src/scss`: SCSS 스타일시트
- `server/src`: 백엔드 API 및 통합 빌드 스크립트

## 🔗 API Reference

- [도서관 정보나루](https://www.data4library.kr)
- [네이버 책 검색 API](https://developers.naver.com/docs/serviceapi/search/book/book.md)

---
*Developed with a focus on web standards and performance.*
