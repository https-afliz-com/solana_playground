const {
    HttpLink,
    ApolloClient,
    InMemoryCache,
    gql,
  } = require("@apollo/client");
  const { ApolloLink, concat } = require("apollo-link");
  const fetch = require("cross-fetch");
  
  const API_KEY = process.env.TENSOR_API_KEY ?? "666b4c68-35d9-4f5a-b9e8-1f9eb48a6391";
  if (!API_KEY) throw new Error("please specify envvar TENSOR_API_KEY");
  
  // Setup Apollo client.
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        "X-TENSOR-API-KEY": API_KEY,
      },
    });
    return forward(operation);
  });
  const httpLink = new HttpLink({ uri: "https://api.tensor.so/graphql", fetch });
  const client = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });

  // Run query.
  (async () => {
    const resp = await client.query({
      query: gql`
        query allInstrumentsTV2(
          $description: String
          $id: String!
          $imageUri: String
          $meFloorPrice: Decimal
          $name: String!
          $symbil: String
          $tswapTVL: Decimal
        ) {
          allInstrumentsTV2(
            sortBy: $InstrumentsSortBy
            stats: $CollectionStats
            statsTSwap: $CollectionStatsTSwap
          ) {
            description
            id
            imageUri
            name
            stats {
                numListed
                volume24h
                }
            symbol
            meFloorPrice
            statsTSwap {
                buyNowPrice
                sellNowPrice
                }
          }
        }
      `,
      variables: {
        description: "Each t00b can be burned to redeem a y00t. Are you going to keep the t00b or get the y00t?",
        id: "29988cd0-4356-4910-bbb6-fb1f030e25c",
        imageUri: "https://bafybeigjqyvd6mrjpqficz3hygcpttmbrlcvkakartrsmqtdfds5nfyjga.ipfs.nftstorage.link/",
        name: "y00ts: mint t00bs",
        numListed: "310",
        volume24h: "6490.59110912",
        symbol: "t00b",
        meFloorPrice: "117",
        buyNowPrice: "120",
        sellNowPrice: "116.45"
      },
    });
  
    const results = resp.data.allInstrumentsTV2;
    console.log(results);
  })();

