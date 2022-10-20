const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HadesSchema = new Schema({
  collectionId: String,
  collectionName: String,
  collectionImage: String,
  bestAsk: Number,
  bestBid: Number,
});

const Hades = mongoose.model("hades", HadesSchema);

module.exports = Hades;
