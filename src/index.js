// Require packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { fetchData } = require("./utils/fetchData");

const { settingTable, getTable } = require("./utils/settingTable");

const { EventEmitter } = require("./services/longPolling/event");

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

// create an instance of our event emitter
const eventEmitter = new EventEmitter();

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

///// EventEmitter Execution
app.get('/', function (req, res) {
  const id = Date.now().toString(); // milliseconds of now will be fine for our case
  var timer = null;
  const handler = function(event) {
     clearTimeout(timer);
     console.log('event', event);
     res.status(201);
     res.end( JSON.stringify(event));
  };

  eventEmitter.register(id, handler);
  timer = setTimeout(function(){ 
     console.log('timeout');
     const wasUnregistered = eventEmitter.unregister(id);
     console.log("wasUnregistered", wasUnregistered);
     if (wasUnregistered){
        res.status(200);
        res.end();
     }
  }, 5000);
});


async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  }).catch(function() {});
}   


async function main() {
  while (true) {
     const waitTimeMS = Math.floor(Math.random() * 10000);
     await sleep(waitTimeMS);
     eventEmitter.fire({time: waitTimeMS});
  }
}


app.listen(port, () => console.log(`Server is running port ${port}`));
