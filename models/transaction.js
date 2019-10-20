var mongoose = require("mongoose");

// TRANSASCTION MODEL
var transactionSchema = mongoose.Schema({
        type: String,
        reference: String,
        amount: String,
        status: String,
        remarks: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", 
            },
            username: String,
        }
});

module.exports = mongoose.model("Transaction", transactionSchema);