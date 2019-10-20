var mongoose = require("mongoose");

//USER MODEL
var documentSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    id: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        },
        username: String,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ]
});
module.exports= mongoose.model("Document", documentSchema);