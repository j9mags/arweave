var express = require("express");
var router  = express.Router({mergeParams: true});
var Document = require("../models/document");
var Transaction = require("../models/transaction");
var middleware = require("../middleware")

//Transactions New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // FIND DOC BY ID
    console.log(req.params.id);
    Document.findById(req.params.id, function(err, document){
        if(err){
            console.log(err);
        } else {
             res.render("transactions/new", {document: document});
        }
    })
});

// CREATE TRANSACTION
router.post("/", middleware.isLoggedIn,function(req, res){
   //LOOK UP USER BY ID
   Document.findById(req.params.id, function(err, document){
       if(err){
           console.log(err);
           res.redirect("/documents");
       } else {
        Transaction.create(req.body.transaction, function(err, transaction){
           if(err){
               req.flash("error", "Something went wrong")
               console.log(err);
           } else {
            transaction.author.id = req.user._id;
            transaction.author.username = req.user.username;       
            transaction.save();
            document.transactions.push(transaction);
            document.save();
            req.flash("success", "Successfully added transaction");
            res.redirect('/documents/' + document._id);
           }
        });
       }
   });
});

router.get("/:transaction_id/edit", middleware.checkTransactionOwnership, function(req, res){
    Transaction.findById(req.params.transaction_id, function(err, foundTransaction){
        if (err) {
            res.redirect("back");
        } else {
            res.render("transactions/edit", {document_id: req.params.id, transaction : foundTransaction});
        }
    }); 
});

router.put("/:transaction_id", middleware.checkTransactionOwnership, function(req, res){
    Transaction.findByIdAndUpdate(req.params.transaction_id, req.body.transaction, function(err, updatedTransaction){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/documents/" + req.params.id);
        }
    });
});

router.delete("/:transaction_id", middleware.checkTransactionOwnership, function(req,res){
    Transaction.findByIdAndRemove(req.params.transaction_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Transaction deleted");
            res.redirect("/documents/" + req.params.id);
        }
    });
});

module.exports = router;