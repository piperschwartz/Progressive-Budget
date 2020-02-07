const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: "Enter a name for your transation."
    },
    value: {
        type: Number,
        required: "Enter an amount",
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model("Transation", transactionSchema);

module.exports = Transaction;