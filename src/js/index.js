import BookList from './BookList.js'
import TestList from './TestList.js'

customElements.define('book-list', BookList)
customElements.define('test-list', TestList)


fetch('/api', {
    method: 'GET'
})
.then((data) => data.json()) 
.then(response => {
    const {authors,
        bookImageURL,
        bookname,
        class_nm,
        class_no,
        description,
        isbn,
        isbn13,
        no,
        publication_date,
        publication_year,
        publisher, 
        libCode,
        hasBook,
        loanAvailable} = response
    document.querySelector('.book')
        .innerHTML = `
        <div>${authors}</div>
        <div><img src="${bookImageURL}"></div>
        <div>${bookname}</div>
        <div>${class_nm}</div>
        <div>${class_no}</div>
        <div>${description}</div>
        <div>${isbn}</div>
        <div>${isbn13}</div>
        <div>${no}</div>
        <div>${publication_date}</div>
        <div>${publication_year}</div>
        <div>${publisher}</div>
        
        `
    document.querySelector('.lib')
        .innerHTML = `
            <div>도선관 코드 : ${libCode}</div>
            <div>소장여부: ${hasBook}</div>
            <div>대출여부: ${loanAvailable}</div>`

})
.catch(e => {
    console.log(e);
});



