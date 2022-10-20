const HadesModel = require("../models/Hades");
const axios = require("axios");
const uuidV4 = require("uuid").v4;

const hadesUrl = "https://hadeswap-api.herokuapp.com/markets";

const getDataHades = async () => {
  const data = await axios.get(hadesUrl);
  if (data.data) {
    await HadesModel.deleteMany();
    const filterList = data.data.map((item) => ({
      collectionId: uuidV4(),
      collectionImage: item.collectionImage,
      collectionName: item.collectionName,
      bestAsk: parseFloat(item.floorPrice),
      bestBid: parseFloat(item.bestoffer),
    }));
    console.log(filterList[0]);
    if (filterList.length > 0) {
      const addHades = await HadesModel.insertMany(filterList);
      return addHades;
    }
  }
};

module.exports = {
  getDataHades,
};
