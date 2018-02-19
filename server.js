const https = require('https');
const express = require('express')
const app = express()
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static('public'))
app.set("view engine", "ejs")

const parseString = require('xml2js').parseString;

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/compare', (req, res) => {
  const oldXmlUrl = req.body.oldUrl;
  const newXmlUrl = req.body.newUrl;
  var oldXml = '';
  var newXml = '';
  https.get(oldXmlUrl, (response) => {
    response.on('data', (chunk) => {
      oldXml += chunk;
    });
    response.on('end', () => {
      https.get(newXmlUrl, (response) => {
        response.on('data', (chunk) => {
          newXml += chunk;
        });
        response.on('end', () => {
          const returnVal = compareXMLs(oldXml, newXml);
          res.send(returnVal);
        });
      });
    });
  });
})

const compareXMLs = (oldXml, newXml) => {
  parseString(oldXml, (err, result) => {
    recordArrayOld = result.informationTable.infoTable;
    parseString(newXml, (err, result) => {
      recordArrayNew = result.informationTable.infoTable;
      return 'result';
    });
  });
};

app.listen(3000, () => console.log('Example app listening on port 3000!'))
