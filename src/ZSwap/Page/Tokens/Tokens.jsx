// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  //wrapper-height
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  //shadow-xl
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  color: black;
`;

const OverflowContainer = styled.div`
  width: 100%;
  padding: 4px 8px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.1);
    background-color: transparent;
    border-radius: 10px;
    margin-top: 0px;
    margin-left: 4px;
  }
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3cd89d;
    border: 1px solid rgba(252, 254, 231, 1);
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 100%;
  gap: 8px;
`;

const Table = styled.div`
  width: 100%;
  padding: 20px;
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 18px;
    thead {
      tr {
        th {
          padding: 24px 16px;
          text-align: left;
          border-bottom: 2px solid #2bcc91;
          background-color: rgba(13, 148, 136, 0.05);
          border-radius: 10px 10px 0 0;
        }
      }
    }
  }
`;

const Tr = styled.tr`
  overflow: hidden;
  td {
    padding: 24px 16px;
    text-align: left;
    background-color: ${(props) => props.cellColor || "white"};
  }
`;

/** State */
State.init({
  NFTs: [
    { name: "Token 1", symbol: "TKN1", price: 1.0, change: 0.1 },
    { name: "Token 2", symbol: "TKN2", price: 2.0, change: 0.2 },
    { name: "Token 3", symbol: "TKN3", price: 3.0, change: 0.3 },
    { name: "Token 4", symbol: "TKN4", price: 4.0, change: 0.4 },
    { name: "Token 5", symbol: "TKN5", price: 5.0, change: 0.5 },
  ],
  TOKENS: {},
  fetchedTokensList: false,
});
/** side effect function */

// function $fetchListOfNFT() {
//   const res = Near.asyncView("manager.zswap.testnet", "nft_tokens_for_owner", {
//     account_id: "traderz.testnet",
//     fee: 3000,
//   });
//   console.log({ res });
// }

/**
 *
 * @param {*} tokenIndex = "firstSelectedToken" or "secondSelectedToken
 */

/** Static variables */

/** Handle events  */

/** Call function */
// $fetchListOfNFT();

const TOKEN_SUFFIX = ".zswap.testnet";
const ZSWAP_MANAGER = "manager3.zswap.testnet";
const ZSWAP_FACTORY = "factory3.zswap.testnet";

function initFetchListOfSampleTokens() {
  return asyncFetch(
    "https://raw.githubusercontent.com/galin-chung-nguyen/efiquant/main/utility/binance-coin-trading/binanceSymbolsInfo.json"
  )
    .then((res) => JSON.parse(res.body))
    .then((TOKEN_RECORDS) => {
      const TOKENS = {};

      Object.keys(TOKEN_RECORDS).forEach((pair) => {
        if (pair.slice(-4) === "USDT") {
          const tokenSymbol = pair.slice(0, -5);
          if (tokenSymbol) {
            if (
              ["ETH", "BTC", "ADA", "NEAR", "BSC", "DOT", "LINK"].includes(
                tokenSymbol.toUpperCase()
              )
            )
              TOKENS[tokenSymbol] = {
                ...TOKEN_RECORDS[pair],
                symbol: tokenSymbol,
                decimals: 20,
                address: tokenSymbol + ".zswap.testnet",
                name: TOKEN_RECORDS[pair].assetName,
                icon: TOKEN_RECORDS[pair].logo,
                priceInUSD: -1,
              };
          }
        }
      });

      return TOKENS;
    });
}

const TOKEN_ACCOUNTS = Near.view(ZSWAP_FACTORY, "get_tokens") ?? [];
console.log(TOKEN_ACCOUNTS);
function fetchTokenMetadata(tokenIndex, currentTOKENS) {
  const tokenAddress = TOKEN_ACCOUNTS[tokenIndex];
  Near.asyncView(tokenAddress, "ft_metadata", {}).then((tokenMetadata) => {
    currentTOKENS[tokenMetadata.symbol] = {
      ...tokenMetadata,
      address: tokenAddress,
      priceInUSD: 0,
    };

    if (tokenIndex >= TOKEN_ACCOUNTS.length - 1) {
      // last token
      State.update({
        TOKENS: currentTOKENS,
      });
    } else {
      fetchTokenMetadata(tokenIndex + 1, currentTOKENS);
    }
  });
}
function $fetchTokenMetadata() {
  initFetchListOfSampleTokens().then((sampleTokens) => {
    fetchTokenMetadata(0, sampleTokens);
  });
}

if (!state.fetchedTokensList && TOKEN_ACCOUNTS.length > 0) {
  State.update({
    fetchedTokensList: true,
  });
  $fetchTokenMetadata();
}

console.log(state);

return (
  <Wrapper>
    <Container>
      <Table>
        <table class="table-fixed">
          <thead>
            <tr>
              <th>No</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Symbol</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(state.TOKENS).map((token, index) => (
              <Tr
                cellColor={index % 2 === 1 && "rgba(13, 148, 136, 0.05)"}
                style={{
                  borderRadius:
                    index === state?.NFTs?.length - 1 ? "0 0 10px 10px" : "",
                }}
              >
                <td>{index + 1}</td>
                <td>
                  <img
                    src={state.TOKENS[token].icon}
                    width={24}
                    height={24}
                    alt={token}
                  />
                </td>
                <td>{state.TOKENS[token].name}</td>
                <td>{state.TOKENS[token].symbol}</td>
              </Tr>
            ))}
          </tbody>
        </table>
      </Table>
    </Container>
  </Wrapper>
);
