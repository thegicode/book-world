# Book World

- [책 검색](./src/html/search-book.html) 
- [책 즐겨찾기](./src/html/favorite.html) 
- [정보공개 도서관](./src/html/library.html) 


## url
- http://localhost:7777/


## TODO
- 관심 도서관 5개까지 설정
- LibraryBookExist : html, css 이중 작업 해결할 것
- LibraryBookExist Custom Element, Web componet 이전 버전과 비
- 목차 api 있는지 확인


## API 
- 도서관 정보나루 : https://www.data4library.kr
- 네이버 책 

## Log 
### 23.01.09
- library-book-exist.html 파일을 한번에 읽어들인다. 
  - 성능에 문제 있을까?
  - 다른 방법은 없을까?

### 23.01.11
- library-book-exist2 브랜치 
  - html 파일을 공통으로 사용하는 방법을 해결하지 못했다.
  - fetch로 가져오면 비동기 문제를 해결할 수가 없었다.
  - 그래서 결국 html에 모든 템플릿을 넣는 원래의 방식으로 진행한다.

