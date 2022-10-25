const { getDataHades } = require("./getDataHades");
const { getDataGoat } = require("./getDataGoat");
const { getDataEden } = require("./getDataEden");
const { getDataTensor } = require("./getDataTensor");

const fetchData = async () => {
    const dataHades = await getDataHades()
    const dataGoat = await getDataGoat()
    const dataEden = await getDataEden()
    const dataTensor = await getDataTensor()
    return  { dataHades, dataGoat, dataEden, dataTensor }
}

module.exports = {
    fetchData
}