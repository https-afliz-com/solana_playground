const TableModel = require("../models/Table");
const LogsModel = require("../models/Logs");
const moment = require('moment');
const mongoose = require('mongoose');

const getLogs = async () => {
  const tableDB = await TableModel.find({});
  let logsArr = [];

  tableDB.forEach((item) => {
    const timestamp = new Date().toLocaleString("en-GB");
    const bestBidHades = item.bestBidRes.hades;
    const bestBidGoat = item.bestBidRes.goat;
    const bestBidEden = item.bestBidRes.eden;
    const bestBidTensor = item.bestBidRes.tensor;

    Object.keys(item.bestAskRes).forEach((key) => {
      if (item.bestAskRes[key] !== 0 && key !== "hades") {
        if (bestBidHades > item.bestAskRes[key]) {
          logsArr.push(
            `${timestamp} Arb found for collection ${
              item.collectionName
            } when best bid on Hades is at ${bestBidHades} > best ask on ${key.toUpperCase()} at ${
              item.bestAskRes[key]
            }`
          );
        }
      }
    });
    Object.keys(item.bestAskRes).forEach((key) => {
      if (item.bestAskRes[key] !== 0 && key !== "eden") {
        if (bestBidEden > item.bestAskRes[key]) {
          logsArr.push(
            `${timestamp} Arb found for collection ${
              item.collectionName
            } when best bid on Eden is at ${bestBidEden} > best ask on ${key.toUpperCase()} at ${
              item.bestAskRes[key]
            }`
          );
        }
      }
    });
    Object.keys(item.bestAskRes).forEach((key) => {
      if (item.bestAskRes[key] !== 0 && key !== "goat") {
        if (bestBidGoat > item.bestAskRes[key]) {
          logsArr.push(
            `${timestamp} Arb found for collection ${
              item.collectionName
            } when best bid on Goat is at ${bestBidGoat} > best ask on ${key.toUpperCase()} at ${
              item.bestAskRes[key]
            }`
          );
        }
      }
    });
    Object.keys(item.bestAskRes).forEach((key) => {
      if (item.bestAskRes[key] !== 0 && key !== "tensor") {
        if (bestBidTensor > item.bestAskRes[key]) {
          logsArr.push(
            `${timestamp} Arb found for collection ${
              item.collectionName
            } when best bid on Tensor is at ${bestBidTensor} > best ask on ${key.toUpperCase()} at ${
              item.bestAskRes[key]
            }`
          );
        }
      }
    });
  });

  if (logsArr.length > 0) {
    const newLogs = new LogsModel({ logs: logsArr });
    await newLogs.save();
  }
  return logsArr;
};

const deleteLogs = async () => {
  const older_than = moment().subtract(1, 'minutes').toDate();
  const Logs = mongoose.connection.collections.logs
  await Logs.find({ timestamp: { $lte: older_than } })
  .deleteMany()
  .then((RemoveStatus) => {
    console.log("Documents Removed Successfully",RemoveStatus);
  })
  .catch((err) => {
    console.error('something error');
    console.error(err)
  });
}

module.exports = {
  getLogs,
  deleteLogs
};
