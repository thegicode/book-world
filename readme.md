# Book World

-   [책 검색](./src/html/search.html)
-   [책 즐겨찾기](./src/html/favorite.html)
-   [정보공개 도서관](./src/html/library.html)

## url

-   http://localhost:7777/

## API

-   도서관 정보나루 : https://www.data4library.kr
-   네이버 책

## TODO

-   버튼 디자인 통일, 모듈화
-   도서 상세 모듈화
-   전자도서관 책 소장/대출 조회 추가
-   template 파일 별도, fetch로 받아올 것
-   build 추가
-   Intersection Observer 오류 수정, 클래스 이름 변경
-   인증키 외부로 변경
-   설정 : 지역 삭제 시 즐겨찾기 도서관 삭제 -> 보류
-   브라우저 이전화면 버튼으로 진입시 관심책 설정이 바뀌어 있지 않다.
-   test 추가
-   접근성, lighthouse

## Finish

-   23.03.17 : 책 이미지 단일 컴포넌트로 통일
-   23.03.17 : ESLint 추가
-   23.03.21 : typescript 적용 완료
-   23.03.22 : BookImage 오류 수정, 타입스크립트 모듈 추가

## 참조

-   도서관 공개 API : https://solomon.data4library.kr/

## package.json

-   개발환경용 : dev, 프로덕션 환경용 : prod
