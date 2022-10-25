const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GoatSchema = new Schema({
  collectionId: String,
  collectionName: String,
  collectionImage: String,
  bestAsk: Number,
  bestBid: Number,
  numListed: Number,
  sales1h: Number,
  volume1h: Number,
});

const GoatModel = mongoose.model("goats", GoatSchema);

module.exports = GoatModel;
