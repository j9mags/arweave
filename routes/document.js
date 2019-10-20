var express = require("express");
var router  = express.Router();
var Document= require("../models/document");
var middleware = require("../middleware")

//INDEX - SHOW ALL
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // GET ALL FROM DB
        Document.find({name: regex}, function(err, allDocuments){
           if(err){
               console.log(err);
           } else {
              if(allDocuments.length < 1) {
                  noMatch = "Nothing matches that query, please try again.";
              }
              res.render("documents/index",{documents:allDocuments, noMatch: noMatch});
           }
        });
    } else {
        // GET ALL FROM DB
        Document.find({}, function(err, allDocuments){
           if(err){
               console.log(err);
           } else {
              res.render("documents/index",{documents:allDocuments, noMatch: noMatch});
           }
        });
    }
});
//CREATE - ADD NEW
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to documents array
    var name = req.body.name;
    var lastname = req.body.lastname;
    var desc = req.body.description;
    var id = req.body.id;
    var author = {
        id: req.user._id,
        username: req.user.username,
    }
    var newDocument = {name: name, lastname: lastname, description: desc, id: id, author: author}
    // CREATE NEW AND SAVE TO DB
    Document.create(newDocument, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // REDIRECT
            res.redirect("/documents");
        }
    });
});

//NEW - SHOW FORM AND ADD TO DB
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("documents/new"); 
});

// SHOW - SHOW MORE INFO
router.get("/:id", function(req, res){
    // FIND DOC BY ID
    Document.findById(req.params.id).populate("transactions").exec(function(err, foundDocument){
        if(err){
            console.log(err);
        } else {
            console.log(foundDocument)
            //render show template with that document
            res.render("documents/show", {document: foundDocument});
        }
    });
});
// EDIT DOC
router.get("/:id/edit", middleware.checkDocumentOwnership, function(req, res){
    Document.findById(req.params.id, function(err, foundDocument){
        res.render("documents/edit", {document: foundDocument});
    });
});

// SAVE EDIT
router.put("/:id", middleware.checkDocumentOwnership, function(req, res){
    Document.findByIdAndUpdate(req.params.id, req.body.document, function(err, updatedDocument){
        if(err){
            res.redirect("/documents");
        } else {
            res.redirect("/documents/" + req.params.id);
        }
    })
})

// DELETE
router.delete("/:id", middleware.checkDocumentOwnership, function(req,res){
    Document.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/documents");
        } else {
            res.redirect("documents");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;