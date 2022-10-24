const TensorModel = require("../models/Tensor");
const axios = require("axios");
const uuidV4 = require("uuid").v4;

const tensorUrl = "https://api.tensor.so/graphql";

const getDataTensor = async () => {
  const data = await axios.get(tensorUrl);
  if (data.data) {
    await TensorModel.deleteMany();
    const filterList = data.data.map((item) => ({
      collectionID: uuidV4(),
      collectionImage: item.collectionImage,
      collectionName: item.collectionName,
      bestAsk: parseFloat(item.floorPrice),
      bestBid: parseFloat(item.bestoffer),
    }));
    console.log(filterList[0]);
    if (filterList.length > 0) {
      const addTensor = await TensorModel.insertMany(filterList);
      return addTensor;
    }
  }
};
  
module.exports = {
  getDataTensor,
};