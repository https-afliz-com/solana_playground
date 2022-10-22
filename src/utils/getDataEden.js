const EdenModel = require("../models/Eden");
const axios = require("axios");
const uuidV4 = require("uuid").v4;

const edenUrl =
  "https://stats-mainnet.magiceden.io/collection_stats/popular_collections/sol?window=1d&limit=1000";

const getDataEden = async () => {
  const data = await axios.get(edenUrl);
  if (data.data) {
    await EdenModel.deleteMany();
    const filterList = data.data.map((item) => {
      const real = parseFloat(item.volDelta) || 0;
      const bestTmp = real * (parseFloat(item.fp) / 1000000000) || 0;
      return {
        collectionId: uuidV4(),
        collectionImage: item.image,
        collectionName: item.name,
        bestAsk: (parseFloat(item.fp) || 0) / 1000000000,
        bestBid: bestTmp,
      };
    });
    console.log(filterList[0]);

    if (filterList.length > 0) {
      const addHades = await EdenModel.insertMany(filterList);
      return addHades;
    }
  }
};

module.exports = {
  getDataEden,
};
