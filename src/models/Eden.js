const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EdenSchema = new Schema({
  collectionId: String,
  collectionName: String,
  collectionImage: String,
  bestAsk: Number,
  bestBid: Number,
  numListed: Number,
  sales1h: Number,
  volume1h: Number,
});

const Eden = mongoose.model("Eden", EdenSchema);

module.exports = Eden;
