const EdenModel = require("../models/Eden");
const axios = require("axios");
const GoatModel = require("../models/Goat");
const HadesModel = require("../models/Hades");
const TensorModel = require("../models/Tensor")
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
        bestAskRes: [
          { tensor: tensorDBItem?.bestAsk || 0 },
          { hades: hadesDBItem?.bestAsk || 0 },
          { goat: goatDBItem?.bestAsk || 0 },
          { eden: item.bestAsk },
        ],
        bestBidRes: [
          { tensor: tensorDBItem?.bestBid || 0 },
          { hades: hadesDBItem?.bestBid || 0 },
          { goat: goatDBItem?.bestBid || 0 },
          { eden: item.bestBid },
        ],
      };
    });
    if (filterList.length > 0) {
      const setTable = await TableModel.insertMany(filterList);
      return setTable;
    }
  }
};

module.exports = {
  settingTable,
};
