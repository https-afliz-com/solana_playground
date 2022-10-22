const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TableSchema = new Schema({
  collectionName: String,

  bestAskRes: Array,
  bestBidRes: Array,
});

const Table = mongoose.model("Table", TableSchema);

module.exports = Table;
