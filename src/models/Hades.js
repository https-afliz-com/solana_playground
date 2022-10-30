const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HadesSchema = new Schema(
  {
    collectionId: String,
    collectionName: String,
    collectionImage: String,
    bestAsk: Number,
    bestBid: Number,
    numListed: Number,
    sales1h: Number,
    volume1h: Number,
  },
  { timestamps: true }
);

const Hades = mongoose.model("hades", HadesSchema);

module.exports = Hades;
