// Require packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { getDataHades } = require("./utils/getDataHades");
const { getDataGoat } = require("./utils/getDataGoat");
const { getDataEden } = require("./utils/getDataEden");
const { getDataTensor } = require("./utils/getDataTensor");
const { settingTable, getTable } = require("./utils/settingTable");

// Configure dotenv
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// Connect to mongoDB server
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connect successfully");
});

app.use(cors());
app.use(express.json());

//Health Check
app.get("/", (req, res) => {
  return res.status(200).json("Welcome");
});

app.get("/getData", async (req, res) => {
  try {
    const dataHades = await getDataHades();
    const dataGoat = await getDataGoat();
    const dataEden = await getDataEden();
    const dataTensor = await getDataTensor();
    if (dataEden && dataGoat && dataTensor && dataHades) {
      return res.status(200).json("Done Job getData");
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
});

app.get("/settingTable", async (req, res) => {
  try {
    const dataTable = await settingTable();
    return res.status(200).json(dataTable);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
});

app.get("/getTable", async (req, res) => {
  try {
    const dataTable = await getTable();
    return res.status(200).json(dataTable);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
});

app.listen(port, () => console.log(`Server is running port ${port}`));
