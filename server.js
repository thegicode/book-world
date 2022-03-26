const express = require('express');
const app = express();
const port = 3000;

console.log(__dirname)
app.use(express.static(`${__dirname}/src/`));

app.listen(port, () => {
  console.log(`Start : http://localhost:${port}`);
});