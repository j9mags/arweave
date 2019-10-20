var Document = require("../models/document");
var Transaction = require("../models/transaction");
var middlewareObj = {};

// CHECK IF USER OWNS DATA
middlewareObj.checkDocumentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Document.findById(req.params.id, function(err, foundDocument){
                if(err){
                    req.flash("error", "Document not found")
                    res.redirect("back");
                    console.log(err);
                } else {
                    if(foundDocument.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You do not have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in")
            res.redirect("back");
        }
    
    }
    
// CHECK IF USER CAN ACCESS DATA
middlewareObj.checkTransactionOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Transaction.findById(req.params.transaction_id, function(err, foundTransaction){
                if(err){
                    req.flash("error", "Document not found");
                    res.redirect("back");
                    console.log(err);
                } else {
                    if(foundTransaction.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    
    }

// CHECK IF USER IS LOGGED IN
middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in.")
        res.redirect("/login");
    }

module.exports = middlewareObj
