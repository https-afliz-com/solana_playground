import fetch from "node-fetch";
import { AlcMongoClient } from "../mongo-client";
import * as dotenv from "dotenv";
dotenv.config();

export interface CollectionStats {
  slug: string;
  name: string;
  numListed: number;
  sales1h: number;
  volume1h: number;
  dbTimeStamp?: number;
  dbInsertTime?: Date;
}

export const getMongoClient = async () => {
  const path = require("path");
  const mongoClient = new AlcMongoClient(
    process.env.DOC_DB_ADD!,
    process.env.DOC_DB_PORT!,
    process.env.DOC_DB_USER!,
    process.env.DOC_DB_PW!,
    path.join(__dirname, "../../../certs/rds-combined-ca-bundle.pem"),
    "SolanaQSData",
  );
  console.log("MongoClient success");
  return mongoClient;
};

const writeStatsToDb = async (mongoClient: AlcMongoClient, collections: CollectionStats[]) => {
  // Define env variables in .env first, with DOC_DB_ADD set to localhost
  // Run dev_scripts/sshtunnel.sh in a separate terminal for local testing
  await mongoClient.insertMany("TensorQS", collections);
  console.log("Inserts of %d documents have been completed", collections.length);
};

const queryAllCollections = async () => {
  const response = await fetch("https://graphql.tensor.trade/graphql", {
    headers: { "content-type": "application/json" },
    body: '{"operationName":"AllInstruments","variables":{},"query":"query AllInstruments($limit: Int, $includeSlugs: [String!]) {\\n  allInstrumentsTV2(limit: $limit, includeSlugs: $includeSlugs) {\\n    ...ReducedInstrument\\n    __typename\\n  }\\n}\\n\\nfragment ReducedInstrument on InstrumentTV2 {\\n  slug\\n  name\\n  symbol\\n  imageUri\\n  stats {\\n    priceUnit\\n    floorPrice\\n    numListed\\n    numMints\\n    sales1h\\n    sales24h\\n    sales7d\\n    volume1h\\n    volume24h\\n    volume7d\\n    floor1h\\n    floor24h\\n    floor7d\\n    __typename\\n  }\\n  firstListDate\\n  __typename\\n}"}',
    method: "POST",
  });
  const json = await response.json();
  const collections = json.data.allInstrumentsTV2;
  let collectionSnapshots: CollectionStats[] = [];
  for (let collection of collections) {
    try {
      const params: CollectionStats = {
        slug: collection.slug,
        name: collection.name,
        numListed: collection.stats.numListed,
        sales1h: collection.stats.sales1h,
        volume1h: collection.stats.volume1h,
      };
      collectionSnapshots.push(params);
    } catch (err) {
      // console.log(err);
      // console.log(collection);
    }
  }
  let insertTime = new Date();
  let timeStamp = Date.now();
  for (let collection of collectionSnapshots) {
    if (collection["slug"] == "thebfgs") {
      console.log(collection["numListed"] + " for " + collection["slug"]);
    }
    collection["dbInsertTime"] = insertTime;
    collection["dbTimeStamp"] = timeStamp;
  }
  console.log(collectionSnapshots.length);
  return collectionSnapshots;
  // 9640 collections out of 10921 in total
};

const writeCollectionStatistics = async (writeSalesToDb: boolean = false) => {
  // Use the fully candles method
  const { performance } = require("perf_hooks");
  const startTime = performance.now();
  const collectionSnapshots: CollectionStats[] = await queryAllCollections();
  if (writeSalesToDb) {
    const mongoClient = await getMongoClient();
    await mongoClient.connect();
    await writeStatsToDb(mongoClient, collectionSnapshots);
    mongoClient.close();
  }
  const endTime = performance.now();
  console.log(`Complete process took ${(endTime - startTime) / 1000} seconds`);
};

writeCollectionStatistics(true);
