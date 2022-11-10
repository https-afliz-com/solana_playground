const axios = require("axios");

const checkBalance = async () => {
    try {
        const data = await axios({
            url: `https://api.mainnet-beta.solana.com`,
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: [
                {
                  jsonrpc: "2.0",
                  id: 1,
                  method: "getBalance",
                  params: [
                    "8UviNr47S8eL6J3WfDxMRa3hvLta1VDJwNWqsDgtN3Cv",
                    "5cSfC32xBUYqGfkURLGfANuK64naHmMp27jUT7LQSujY"
                  ],
                },
            ]
        });
        return data
    } catch (error) {
        console.log(error)
    }
} 

module.exports = {
    checkBalance,
  };