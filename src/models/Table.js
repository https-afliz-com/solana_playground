const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TableSchema = new Schema({
  collectionName: String,
  collectionImage: String,
  bestAskRes: {
    tensor: Number,
    hades: Number,
    goat: Number,
    eden: Number,
  },
  bestBidRes: {
    tensor: Number,
    hades: Number,
    goat: Number,
    eden: Number,
  },
  numListed: {
    tensor: Number,
    // hades: Number,
    // goat: Number,
    // eden: Number,
  },
  sales1h: {
    tensor: Number,
    // hades: Number,
    // goat: Number,
    // eden: Number,
  },
  volume1h: {
    tensor: Number,
    // hades: Number,
    // goat: Number,
    // eden: Number,
  },
});

const Table = mongoose.model("Table", TableSchema);

module.exports = Table;
