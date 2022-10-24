const TensorModel = require("../models/Tensor");
const axios = require("axios");
const uuidV4 = require("uuid").v4;

const TensorData = requrie("../utils/client/settingApolloClient")
  
const getDataTensor = async () => {
  const data = await axios.get(TensorData);
};
  
module.exports = {
  getDataTensor,
};