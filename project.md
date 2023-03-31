project-root
├── src
│ ├── assets
│ │ ├── images
│ │ └── json
│ ├── css
│ │ ├── home.css
│ │ └── about.css
│ ├── components
│ │ ├── Button
│ │ │ └── index.ts
│ │ └── Navbar
│ │ └── index.ts
│ ├── pages
│ │ ├── Home
│ │ │ └── index.ts
│ │ └── About
│ │ │ └── index.ts
│ ├── html
│ │ ├── home.html
│ │ └── about.html
│ ├── sass
│ │ ├── components
│ │ │ ├── \_button.scss
│ │ │ └── \_navbar.scss
│ │ ├── pages
│ │ │ ├── \_home.scss
│ │ │ └── \_about.scss
│ │ └── main.scss
│ ├── server
│ │ ├── apiHandlers.ts
│ │ ├── config.ts
│ │ ├── routes.ts
│ │ └── utils.ts
│ └── index.ts
├── dist
│ ├── assets
│ │ ├── images
│ │ └── fonts
│ ├── html
│ │ ├── home.html
│ │ └── about.html
│ ├── css
│ │ ├── home.css
│ │ └── about.css
│ ├── js
│ │ ├── home.js
│ │ └── about.js
│ ├── server
│ │ ├── apiHandlers.js
│ │ ├── config.js
│ │ ├── routes.js
│ │ └── utils.js
│ └── index.js
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

project-root
├── src
│ ├── assets
│ │ ├── images
│ │ └── fonts
│ ├── css
│ │ └── main.css
│ ├── html
│ │ └── index.html
│ ├── ts
│ │ └── main.ts
│ ├── ...
├── dist
│ ├── dev
│ │ ├── assets
│ │ │ ├── images
│ │ │ └── fonts
│ │ ├── css
│ │ │ └── main.css
│ │ ├── html
│ │ │ └── index.html
│ │ ├── js
│ │ │ └── main.js
│ │ └── ...
│ ├── prod
│ │ ├── assets
│ │ │ ├── images
│ │ │ └── fonts
│ │ ├── css
│ │ │ └── main.min.css
│ │ ├── html
│ │ │ └── index.min.html
│ │ ├── js
│ │ │ └── main.bundle.js
│ │ └── ...
│ └── ...

project/
├── public/
│ ├── index.html
│ └── assets/
│ ├── images/
│ ├── css/
│ └── js/
└── src/
├── components/
│ ├── Header/
│ │ ├── Header.js
│ │ ├── Header.css
│ │ └── index.js
│ └── Footer/
│ ├── Footer.js
│ ├── Footer.css
│ └── index.js
├── pages/
│ ├── Home/
│ │ ├── Home.js
│ │ ├── Home.css
│ │ └── index.js
│ ├── About/
│ │ ├── About.js
│ │ ├── About.css
│ │ └── index.js
│ └── Contact/
│ ├── Contact.js
│ ├── Contact.css
│ └── index.js
├── utils/
│ ├── api.js
│ ├── constants.js
│ └── helpers.js
├── App.js
├── index.js
└── index.css

2023.03.31 app 폴더 아

├── src/ # 모든 원본 코드가 위치하는 디렉토리
│ ├── index.html # 어플리케이션의 진입점 HTML 파일
│ ├── index.ts # 어플리케이션의 진입점 TypeScript 파일
│ ├── app/ # 어플리케이션의 주요 코드 디렉토리
│ │ ├── components/ # 컴포넌트 디렉토리
│ │ ├── services/ # 서비스 디렉토리
│ │ ├── utils/ # 유틸리티 디렉토리
│ │ ├── styles/ # 스타일 디렉토리
│ │ ├── app.ts # 어플리케이션의 메인 TypeScript 파일
│ │ ├── app.spec.ts # 어플리케이션의 메인 TypeScript 파일에 대한 테스트 파일
│ │ └── app.scss # 어플리케이션의 메인 스타일 파일
│ └── assets/ # 이미지, 폰트 등 어플리케이션에서 사용되는 자원을 보관하는 디렉토리
│ ├── images/
│ ├── fonts/
│ └── ...
├── dist/ # TypeScript, SASS 등의 코드가 컴파일되어 배포될 코드가 위치하는 디렉토리
├── node_modules/ # 프로젝트에서 사용되는 모든 패키지와 라이브러리를 보관하는 디렉토리
├── package.json # 프로젝트의 패키지 정보와 의존성 목록을 포함하는 파일
├── tsconfig.json # TypeScript 컴파일러의 설정 파일
└── ...
