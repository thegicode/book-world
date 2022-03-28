const express = require('express');
const app = express();
const port = 8000;
const axios = require('axios').default;

const key = require("./user.js").user

app.use(express.static(`${__dirname}/src/`));

app.get('/api', function(req, res) {

  const url1 = `http://data4library.kr/api/srchDtlList?authKey=${key}&isbn13=9788960532410&&format=json`
  const url2 = `http://data4library.kr/api/bookExist?authKey=${key}&isbn13=9788960532410&libCode=111007&format=json`

  const requestOne = axios.get(url1)
  const requestTwo = axios.get(url2)

  axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
    const responseOne = responses[0].data.response.detail[0].book
    const responseTwo = responses[1].data.response
    const { libCode } = responseTwo.request
    res.send({...responseOne, libCode, ...responseTwo.result})
  })).catch(errors => {
  })

});

app.listen(port, () => {
  console.log(`Start : http://localhost:${port}`);
});


// 111007 고덕도서관
