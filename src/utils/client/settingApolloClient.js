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
const allInstrumentsTV2 = async () => {
    const resp = await client.query({
      query: gql`
        query allInstrumentsTV2 ($limit: Int) {
          allInstrumentsTV2(limit: $limit) {
            id
            imageUri
            meFloorPrice
            name
            stats {
              numListed
              volume24h
            }
            tswapTVL
            statsTSwap {
              sellNowPrice
            }
          }
        }
      `,
      variables: {
        limit: 2,
      },
    });
  
    const results = resp.data.allInstrumentsTV2;
    return results
  };


module.exports = {
  allInstrumentsTV2
}