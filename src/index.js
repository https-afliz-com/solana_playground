// Require packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { fetchData } = require("./utils/fetchData");

const { settingTable, getTable } = require("./utils/settingTable");
const { getLogs } = require("./utils/getLogs");

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
    const data = await fetchData();
    if (data) {
      return res.status(200).json("Done Job getData");
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
});

app.get("/settingTable", async (req, res) => {
  try {
    await fetchData();
    const dataTable = await settingTable();
    return res.status(200).json(dataTable);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
});

app.get("/getTable", async (req, res) => {
  try {
    await fetchData();
    const dataTable = await getTable();
    return res.status(200).json(dataTable);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
});

app.get("/getLogs", async (req, res) => {
  const getLog = await getLogs();
  return res.status(200).json(getLog);
});

app.listen(port, () => console.log(`Server is running port ${port}`));

// auto run every 30s
setInterval(async () => {
  try {
    const data = await fetchData();
    if (data) {
      const dataTable = await settingTable();
      if (dataTable) {
        const getLog = await getLogs();
        if (getLog) {
          console.log("Done Job");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}, 1000 * 30);
