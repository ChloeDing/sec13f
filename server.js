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
          const oldVsNewList = compareXMLs(oldXml, newXml); //oldVsNewList is an object
          var returnArray = [];
          returnArray = Object.keys(oldVsNewList).map((eachCusip) => {
            return oldVsNewList[eachCusip];
          });
          res.send(returnArray);
        });
      });
    });
  });
})

const compareXMLs = (oldXml, newXml) => {
  var oldVsNewList = {};
  parseString(oldXml, (err, result) => {
    recordArrayOld = result.informationTable.infoTable;
    parseString(newXml, (err, result) => {
      recordArrayNew = result.informationTable.infoTable;

      oldList = {}; // Better formated
      newList = {}; // Better formated
      recordArrayOld.forEach((eachRecord) => {
        var eachRow = {};
        eachRow['Company Name'] = eachRecord.nameOfIssuer[0];
        eachRow['Shares'] = eachRecord.shrsOrPrnAmt[0].sshPrnamt[0];
        eachRow['Value'] = eachRecord.value[0];
        oldList[eachRecord.cusip[0]] = eachRow;
      });
      recordArrayNew.forEach((eachRecord) => {
        var eachRow = {};
        eachRow['Company Name'] = eachRecord.nameOfIssuer[0];
        eachRow['Shares'] = eachRecord.shrsOrPrnAmt[0].sshPrnamt[0];
        eachRow['Value'] = eachRecord.value[0];
        newList[eachRecord.cusip[0]] = eachRow;
      });
      for (var cusip in oldList) {
        if (newList[cusip] === undefined) {
          newList[cusip] = {};
          newList[cusip]['Company Name'] = oldList[cusip]['Company Name'];
          newList[cusip]['Shares'] = 0;
          newList[cusip]['Value'] = 0;
        }
      }
      for (var cusip in newList) {
        if (oldList[cusip] === undefined) {
          oldList[cusip] = {};
          oldList[cusip]['Company Name'] = newList[cusip]['Company Name'];
          oldList[cusip]['Shares'] = 0;
          oldList[cusip]['Value'] = 0;
        }
      }
      // Now oldList and newList have same list of companies
      for (var cusip in oldList) {
        oldVsNewList[cusip] = {};
        var note = '';
        if (oldList[cusip]['Company Name'] === newList[cusip]['Company Name']) {
          oldVsNewList[cusip]['Company Name'] = oldList[cusip]['Company Name'];
        } else {
          note = note + 'Company name does not match.';
          oldVsNewList[cusip]['Company Name'] = 'old: ' + oldList[cusip]['Company Name'] + ' vs new: ' + newList[cusip]['Company Name'];
        }
        oldVsNewList[cusip]['Old Shares'] = oldList[cusip]['Shares'];
        oldVsNewList[cusip]['New Shares'] = newList[cusip]['Shares'];
        oldVsNewList[cusip]['Old Value'] = oldList[cusip]['Value'];
        oldVsNewList[cusip]['New Value'] = newList[cusip]['Value'];
        oldVsNewList[cusip]['Share Change'] = ( newList[cusip]['Shares'] - oldList[cusip]['Shares'] ) / oldList[cusip]['Shares'];
        oldVsNewList[cusip]['Note'] = note;
        oldVsNewList[cusip]['CUSIP'] = cusip;
      }
    });
  });
  return oldVsNewList;
};

app.listen(3000, () => console.log('Example app listening on port 3000!'))
