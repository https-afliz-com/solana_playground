const EdenModel = require("../models/Eden");
const axios = require("axios");
const GoatModel = require("../models/Goat");
const HadesModel = require("../models/Hades");
const TensorModel = require("../models/Tensor");
const TableModel = require("../models/Table");
const uuidV4 = require("uuid").v4;

const settingTable = async () => {
  const edenDB = await EdenModel.find({});
  const goatDB = await GoatModel.find({});
  const hadesDB = await HadesModel.find({});
  const tensorDB = await TensorModel.find({});

  await TableModel.deleteMany();

  if (edenDB && goatDB && hadesDB && tensorDB) {
    const filterList = edenDB.map((item) => {
      const goatDBItem = goatDB.find(
        (goatItem) => goatItem.collectionName === item.collectionName
      );
      const hadesDBItem = hadesDB.find(
        (hadesItem) => hadesItem.collectionName === item.collectionName
      );
      const tensorDBItem = tensorDB.find(
        (tensorItem) => tensorItem.collectionName === item.collectionName
      );

      return {
        collectionName: item.collectionName,
        collectionImage: item.collectionImage,
        bestAskRes: {
          tensor: tensorDBItem?.bestAsk || 0,
          hades: hadesDBItem?.bestAsk || 0,
          goat: goatDBItem?.bestAsk || 0,
          eden: item.bestAsk || 0,
        },
        bestBidRes: {
          tensor: tensorDBItem?.bestBid || 0,
          hades: hadesDBItem?.bestBid || 0,
          goat: goatDBItem?.bestBid || 0,
          eden: item.bestBid,
        },
        numListed: {
          tensor: tensorDBItem?.numListed || 0,
          // hades: Number,
          // goat: Number,
          // eden: Number,
        },
        sales1h: {
          tensor: tensorDBItem?.sales1h || 0,
          // hades: Number,
          // goat: Number,
          // eden: Number,
        },
        volume1h: {
          tensor: tensorDBItem?.volume1h || 0,
          // hades: Number,
          // goat: Number,
          // eden: Number,
        },
      };
    });
    if (filterList.length > 0) {
      const setTable = await TableModel.insertMany(filterList);
      return setTable;
    }
  }
};

const getTable = async () => {
  const tableDB = await TableModel.find({});

  return tableDB;
};

module.exports = {
  settingTable,
  getTable,
};
