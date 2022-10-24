const TensorModel = require("../models/Tensor");
const uuidV4 = require("uuid").v4;

const client = require("./client/settingApolloClient").allInstrumentsTV2;

const getDataTensor = async () => {
  const data = await client();
  if (data) {
    await TensorModel.deleteMany();
    const filterList = data.map((item) => ({
      collectionID: uuidV4(),
      collectionImage: item.imageUri,
      collectionName: item.name,
      bestAsk: parseFloat(item.meFloorPrice) || 0,
      bestBid: item.statsTSwap
        ? parseFloat(item.statsTSwap?.sellNowPrice) || 0
        : 0,
    }));

    if (filterList.length > 0) {
      const addTensor = await TensorModel.insertMany(filterList);
      return addTensor;
    }
  }
};

module.exports = {
  getDataTensor,
};
