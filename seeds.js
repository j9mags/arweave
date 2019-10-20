var mongoose = require("mongoose");
var Document = require("./models/document");
var Transaction  = require("./models/transaction");
var xlsx = require("xlsx");

var wb = xlsx.readFile("file.xlsx");
var wb2 = xlsx.readFile("newfile.xlsx");
var ws = wb.Sheets["Sheet 1"];
var ws2 = wb2.Sheets["New Data"];
var data = xlsx.utils.sheet_to_json(ws);
var data2 = xlsx.utils.sheet_to_json(ws2);

function seedDB(){
   //REMOVE USERS FIRST
   Document.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed documents!");
        //  ADD NEW USER FROM EXCEL FILE
        data.forEach(function(seed){
            Document.create(seed, function(err, document){
                if(err){
                    console.log(err)
                } else {
                    console.log(data);
                    data2.forEach(function(seed2){
                        Transaction.create({data2}, function (err,transaction){
                            if(err){
                                console.log(err);
                            } else {
                                document.transactions.push(transaction);
                                document.save();
                                console.log(data2)
                            }
                    });
                 
                    })
                }
            });
        });
    }); 
}

module.exports = seedDB;