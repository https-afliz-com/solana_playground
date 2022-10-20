const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TensorSchema = new Schema({
  collectionId: String,
  collectionName: String,
  collectionImage: String,
  bestAsk: Number,
  bestBid: Number,
});

const Tensor = mongoose.model("Tensor", TensorSchema);

module.exports = Tensor;
