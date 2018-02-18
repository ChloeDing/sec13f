const express = require('express')
const app = express()

app.set("view engine", "ejs")

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/compare', (req, res) => {
  const oldUrl = req.params.oldUrl;
  const newUrl = req.params.newUrl;
  var returnVal = compareXMLs(oldUrl, newUrl);
  res.send(returnVal);
})

const compareXMLs = (oldUrl, newUrl) => {
  return "something";
};

app.listen(3000, () => console.log('Example app listening on port 3000!'))
