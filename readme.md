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
- library-book-exist.html 파일을 한번 읽어들인다. 
  - 성능에 문제 있을까?
  - 다른 방법은 없을까?
  - 공통으로 쓰기 위해 로컬스토리지를 이용하는 방법
- library-book-exist 엘리먼트를 한 군데서 수정하면 다른 곳도 자동수정이 되게 하는 방법은 어떨까?
  - 예) serach-book, favorite에 공통 엘리먼트가 있는데 한 페이지에서 수정하면 다른 페이지에서도 수정하는 것.
  - 오히려 불편할 수도 있다. 
