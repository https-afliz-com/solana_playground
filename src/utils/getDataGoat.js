const GoatModel = require("../models/Goat");
const axios = require("axios");
const uuidV4 = require("uuid").v4;

const goatUrl =
  // "https://corsanywhere.herokuapp.com/https://goatswap.xyz/api/trpc/collectionMetas.all";
  "https://goatswap.xyz/api/trpc/collectionMetas.all";

const getDataGoat = async () => {
  const response = await axios.get(goatUrl, {
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    // },
  });
  if (response.data) {
    await GoatModel.deleteMany();

    const filterList = response.data.result.data.json.map((item) => ({
      collectionId: uuidV4(),
      collectionImage: item.image,
      collectionName: item.name,
      bestAsk: parseFloat(item.floorPrice) / 1000000000 || 0,
      bestBid:
        (parseFloat(item.bestOffer) / 10000000 || 0) *
        (parseFloat(item.floorPrice) / 1000000000 || 0),
    }));

    if (filterList.length > 0) {
      const addGoat = await GoatModel.insertMany(filterList);
      return addGoat;
    }
  }
};

module.exports = {
  getDataGoat,
};
