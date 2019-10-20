
var xlsx = require("xlsx");
var json2xls = require('json2xls');
var request = require('request');
var url = require("url")

// CONVERT WS TO JSON
var wb = xlsx.readFile("file.xlsx");
var wb2 = xlsx.readFile("newfile.xlsx");
var ws = wb.Sheets["Sheet 1"];
var ws2 = wb2.Sheets["New Data"];
var details = xlsx.utils.sheet_to_json(ws);

let resp = null;

// GET API
request("https://dex.binance.org/api/v1/tokens", function(error, response,body){
    if(!error && response.statusCode == 200 ){
        //console.log(JSON.parse(body));

        resp = JSON.parse(body);
        var newWB = xlsx.utils.book_new();
        var newWS = xlsx.utils.json_to_sheet(resp);
        xlsx.utils.book_append_sheet(newWB, newWS, "New Data");
        xlsx.writeFile(newWB, "newfile.xlsx")
       }
})







