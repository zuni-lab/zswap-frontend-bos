// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

// HTML

const SwapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  //wrapper-height
  height: 500px;
  padding: 20px;
  border-radius: 10px;
  //shadow-xl
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  color: black;
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

const ArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #6b7280;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
    color: #2bcc91;
  }
`;

/** State */
State.init({
  firstSelectedToken: {
    name: "",
    amount: "",
  },
  secondSelectedToken: {
    name: "",
    amount: "",
  },
  inputError: "",
  tokenRecords: {},
  firstFetchedFlag: false,
});
/** CONSTANTS */
const TOKEN_ACCOUNTS = ["zusd.zswap.testnet", "znear.zswap.testnet"];

/** Static functions */
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
        tokenRecords: currentTOKENS,
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

/** Static variables */

/** Handle events  */
const onChange = (e) => {
  if (isNaN(e.target.value)) {
    State.update({
      inputError: "Invalid input",
    });
    return;
  }

  State.update({
    firstSelectedToken: { ...state.firstSelectedToken, amount: e.target.value },
    inputError: "",
  });
};

const onClickMax = () => {
  console.log("Max");
};

const onFirstTokenChange = (token) => {
  State.update({
    firstSelectedToken: { ...state.firstSelectedToken, name: token },
  });
};

const onSecondTokenChange = (token) => {
  State.update({
    secondSelectedToken: { ...state.secondSelectedToken, name: token },
  });
};

/** Call function */
if (!state.firstFetchedFlag) {
  $fetchTokenMetadata();
  State.update({
    firstFetchedFlag: true,
  });
}

const listToken = Object.entries(state.tokenRecords).map(([_, token]) => {
  return {
    symbol: token.symbol,
    icon: token.icon,
  };
});

return (
  <SwapWrapper>
    <Container>
      <Widget
        src={`${props?.config.ownerId}/widget/ZSwap.Element.Input`}
        props={{
          config: props?.config,
          label: "You send",
          value: state.firstSelectedToken.amount,
          inputError: state.inputError,
          balance: "Nothing",
          selectedToken: state.firstSelectedToken.name,
          listToken: listToken,
          showBalance: true,
          onChange: onChange,
          onClickMax: onClickMax,
          onChangeToken: onFirstTokenChange,
        }}
      />
      <Widget
        src={`${props?.config.ownerId}/widget/ZSwap.Element.Input`}
        props={{
          config: props?.config,
          label: "You receive",
          value: state.secondSelectedToken.amount,
          inputError: state.inputError,
          balance: "Nothing",
          selectedToken: state.secondSelectedToken.name,
          listToken: listToken,
          showBalance: false,
          onChange: onChange,
          onClickMax: onClickMax,
          onChangeToken: onSecondTokenChange,
        }}
      />
      <ArrowWrapper>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          width={24}
          height={24}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
          />
        </svg>
      </ArrowWrapper>
    </Container>
  </SwapWrapper>
);
