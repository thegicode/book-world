const express = require('express');
const app = express();
const port = 7777;
const axios = require('axios').default;

app.use(express.static(`${__dirname}/src/`));

const { libKey, naverKey } = require("./user.js")

/** NAVER */

// 키워드 검색
app.get('/naver', function(req, res) {
    const { keyword, display, start } = req.query
    axios.get(`https://openapi.naver.com/v1/search/book.json`, {
        params: {
            query: keyword, 
            display, 
            start
        },
        headers: {
            "X-Naver-Client-Id": naverKey.clientID,
            "X-Naver-Client-Secret": naverKey.clientSecret
        }
    })
    .then( response => {
        // console.log(response.data)
        const { total, start, display, items } = response.data
        res.send({total, start, display, items})
    })
    .catch(error => {
        console.log('naver error', error)
    })
});



/** 도서관 정보나루 */
const host = 'http://data4library.kr/api'
const authKey = `authKey=${libKey}`
const foramt = 'format=json'

// 정보공개 도서관 조회
app.get('/libSrch', function(req, res) {

    const { regionCode, page, pageSize } = req.query

    const url = `${host}/libSrch?${authKey}&dtl_region=${regionCode}&pageNo=${page}&pageSize=${pageSize}&${foramt}`
    axios.get(url)
        .then( response => {
            const { pageNo, pageSize, numFound, resultNum, libs } = response.data.response
            const data = {
                // request, 
                pageNo, 
                pageSize, 
                numFound, 
                resultNum, 
                libs: libs.map( item => item.lib)
            }
            res.send(data)
        })
        .catch(error => {
            console.log(error)
        })
});

// 지정 도서관, 책 소장 & 대출 가능 여부
app.get('/library-bookExist', function(req, res) {
    const { isbn13, libCode } = req.query

    const isbn = `isbn13=${isbn13}`
    const lib = `libCode=${libCode}`

    const url = `${host}/bookExist?${authKey}&${isbn}&${lib}&${foramt}`

    axios.get(url)
        .then( response => {
            // console.log(response.data.response.result)
            res.send(response.data.response.result)
        })
        .catch(error => {
            console.log(error)
        })
});

// 도서관별 장서/대출 데이터 조회
app.get('/library-itemSrch', function(req, res) {
    const { libCode, keyword } = req.query

    // console.log(keyword, libCode)
    
    const lib = `libCode=${libCode}`
    const keywordStr = `keyword=${encodeURIComponent(keyword)}`

    const url = `${host}/srchBooks?${authKey}&keyword=%EC%97%AD%EC%82%AC&pageNo=1&pageSize=10&format=json`
    // console.log(url)

    axios.get(url)
        .then( response => {
            res.send(response.data.response.docs)
        })
        .catch(error => {
            console.log(error)
        })
});


// 도서 상세 조회
app.get('/srchDtlList', function(req, res) {
    const { isbn13 } = req.query

    const url = `${host}/srchDtlList?${authKey}&isbn13=${isbn13}&loaninfoYN=Y&format=json`
    // console.log(url)

    axios.get(url)
        .then( response => {
            const { detail, loanInfo, request} = response.data.response
            const data = {
                detail: detail[0].book,
                loanInfo,
                loanInfoYN: request.loaninfoYN
            }
            res.send(data)
        })
        .catch(error => {
            console.log(error)
        })
});


// 도서별 이용 분석
app.get('/usageAnalysisList', function(req, res) {
    const { isbn13 } = req.query

    const url = `${host}/usageAnalysisList?${authKey}&isbn13=${isbn13}&loaninfoYN=Y&format=json`

    axios.get(url)
        .then( response => {
            const { 
                book, 
                loanHistory,
                loanGrps,
                keywords,
                recBooks,
                coLoanBooks 
            } = response.data.response

            res.send({ 
                book, 
                loanHistory: loanHistory.map(item => item.loan),
                loanGrps: loanGrps.map(item => item.loanGrp),
                keywords: keywords.map(item => item.keyword),
                recBooks: recBooks.map(item => item.book) ,
                coLoanBooks: coLoanBooks.map(item => item.book) })
        })
        .catch(error => {
            console.log(error)
        })
});


// app.get('/b', function(req, res) {
//     const { isbn13, libCode } = req.query
//     const isbn = `isbn13=${isbn13}`
//     const lib = `libCode=${libCode}`

//     const url1 = `${host}/srchDtlList?${authKey}&${isbn}&&${foramt}`
//     const url2 = `${host}/bookExist?${authKey}&${isbn}&${lib}&${foramt}`

//     const requestOne = axios.get(url1)
//     const requestTwo = axios.get(url2)

//     axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
//         const responseOne = responses[0].data.response.detail[0].book
//         const responseTwo = responses[1].data.response
//         const { libCode } = responseTwo.request
//         res.send({...responseOne, libCode, ...responseTwo.result})
//     })).catch(error => {
//     })
// });

app.listen(port, () => {
    console.log(`Start : http://localhost:${port}`);
});


// 111007 고덕도서관
