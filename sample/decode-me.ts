import { Connection, ParsedInstruction, PartiallyDecodedInstruction, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import * as BufferLayout from "@solana/buffer-layout";
import * as Layout from "./layouts";
import base58 from "bs58";

export interface NftSalesinfo {
  buyerPrice: bigint;
  tokenMint: string;
  symbol: string;
}

export interface ProtoBuy {
  progInstructions: any;
  buyerStateBump: number;
  escrowPAymentBump: number;
  buyerPrice: bigint;
  tokenSize: bigint;
  buyerStateExpiry: bigint;
}

export const BuyLayout: BufferLayout.Structure<any> = BufferLayout.struct([
  /**this is prob some instruction thingie but not 100% sure*/
  BufferLayout.blob(8, "progInstructions"),
  BufferLayout.u8("buyerStateBump"),
  BufferLayout.u8("escrowPaymentBump"),
  Layout.u64("buyerPrice"),
  Layout.u64("tokenSize"),
  Layout.i64("buyerStateExpiry"),
]);

export interface ProtoExecuteSale {
  progInstructions: any;
  escrowPaymentBump: number;
  programAsSignerBump: number;
  buyerPrice: bigint;
  tokenSize: bigint;
  buyerStateExpiry: bigint;
  sellerStateExpiry: bigint;
}

export const ExecuteSaleLayout: BufferLayout.Structure<any> = BufferLayout.struct([
  /**this is prob some instruction thingie but not 100% sure*/
  BufferLayout.blob(8, "progInstructions"),
  BufferLayout.u8("escrowPaymentBump"),
  BufferLayout.u8("programAsSignerBump"),
  Layout.u64("buyerPrice"),
  Layout.u64("tokenSize"),
  Layout.i64("buyerStateExpiry"),
  Layout.i64("sellerStateExpiry"),
]);

const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

const asyncFn = async (connection: Connection, metaplex: Metaplex) => {
  const meV2Program = new PublicKey("M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K");

  const options = { limit: 10 };
  let signatures;

  while (true) {
    signatures = await connection.getSignaturesForAddress(meV2Program, options);
    for (let s of signatures) {
      const signature = s.signature;
      const parsedTx = await connection.getTransaction(signature);
      const logs = parsedTx?.meta?.logMessages ?? [];
      if (logs.length > 14 && logs[14] === "Program log: Instruction: ExecuteSale") {
        const instructions = parsedTx?.transaction.message.instructions;

        if (instructions && instructions.length > 2) {
          const [withdrawInst, buyInst, executeSaleInst] = instructions;
          const [buyerIdx, sellerIdx, notaryIdx, tokenAccountIdx, tokenMintIdx] = executeSaleInst.accounts.slice(0, 5);
          const tokenMint = parsedTx.transaction.message.accountKeys[tokenMintIdx].toBase58();

          const buyBuffer = base58.decode(buyInst.data);
          const executeSaleBuffer = base58.decode(executeSaleInst.data);

          const {
            progInstructions,
            escrowPaymentBump,
            programAsSignerBump,
            buyerPrice,
            tokenSize,
            buyerStateExpiry,
            sellerStateExpiry,
          } = ExecuteSaleLayout.decode(executeSaleBuffer) as ProtoExecuteSale;

          const tokenSymbol = await metaplexBullshit(metaplex, new PublicKey(tokenMint));
          const nsi: NftSalesinfo = {
            buyerPrice: buyerPrice,
            tokenMint: tokenMint,
            symbol: tokenSymbol,
          };
          console.log(nsi);
        }
      }
    }
    // console.log(timer)
    // await timer(3000);
  }
};

const metaplexBullshit = async (metaplex: Metaplex, mint: PublicKey) => {
  const nft = await metaplex.nfts().findByMint(mint).run();
  return nft.symbol;
};

const rpcEndpoint = "https://bold-bitter-grass.solana-mainnet.quiknode.pro/2f7af02a3fac89be66bfcb6d32472241025784d7/";
const connection = new Connection(rpcEndpoint, "confirmed");
const metaplex = new Metaplex(connection);

asyncFn(connection, metaplex);
