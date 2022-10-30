const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LogsSchema = new Schema(
  {
    logs: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Logs = mongoose.model("logs", LogsSchema);

module.exports = Logs;
