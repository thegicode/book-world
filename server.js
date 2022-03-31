const express = require('express');
const app = express();
const port = 8000;
const axios = require('axios').default;

app.use(express.static(`${__dirname}/src/`));

const { libKey, naverKey } = require("./user.js")


app.get('/naver', function(req, res) {
    const { name, display, start } = req.query
    axios.get(`https://openapi.naver.com/v1/search/book.json`, {
        params: {
            query: name, 
            display, 
            start
        },
        headers: {
            "X-Naver-Client-Id": naverKey.clientID,
            "X-Naver-Client-Secret": naverKey.clientSecret
        }
    })
    .then( response => {
        const { total, start, display, items } = response.data
        res.send({total, start, display, items})
    })
    .catch(errors => {
        console.log('naver error', error)
    })
});



// const host = 'http://data4library.kr/api'
// const authKey = `authKey=${libKey}`
// const foramt = 'format=json'

// app.get('/a', function(req, res) {
//     const { isbn13, libCode } = req.query
    
//     const isbn = `isbn13=${isbn13}`
//     const lib = `libCode=${libCode}`

//     const url = `${host}/itemSrch?type=ALL&${lib}&${authKey}&pageNo=1&pageSize=10&${foramt}`

//     axios.get(url)
//         .then( response => {
//             console.log(response.data.response)
//             res.send(response.data.response)
//         })
//         .catch(errors => {
//             console.log(error)
//         })
// });


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
//     })).catch(errors => {
//     })
// });

app.listen(port, () => {
    console.log(`Start : http://localhost:${port}`);
});


// 111007 고덕도서관
