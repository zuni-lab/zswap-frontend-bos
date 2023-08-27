// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

// HTML

const DECIMALS = 24;

const Button = styled.button`
  height: 50px;
  width: ${(props) => props.width || "100%"};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props.background ?? "#2BCC91"};
  color: white;
  border-radius: 10px;
  font-weight: bold;
  overflow: hidden;
  padding: ${padding === "normal" ? "8px 0" : "12px 24px"};
  cursor: pointer;
  border: none;
  z-index: 0;
  &:disabled {
    background: #9ca3af;
    color: white;
  }

  &:hover {
    opacity: ${props.disabled ? "1" : "0.8"};
  }
  &:hover:before {
    opacity: ${props.disabled ? "0" : "1"};
  }
`;

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
  transform: translateY(calc(50% - 32px));
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
    symbol: "",
    amount: "",
    priceInUSD: 0,
    balance: 0,
    inputError: "",
  },
  secondSelectedToken: {
    symbol: "",
    amount: "",
    priceInUSD: 0,
    balance: 0,
    inputError: "",
  },
  poolId: "",
  tokenRecords: {},
  currentPrice: 0,
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
const getTokenBalanceOfUser = (address) => {
  const accountId = context.accountId;
  return Near.asyncView(address, "ft_balance_of", {
    account_id: accountId,
  })
    .catch((err) => {
      console.log(err);
      return "N/A";
    })
    .then((bl) => Number(bl))
    .then((bl) => (Number.isNaN(bl) ? 0 : bl));
};

/** side effect function */

function $fetchTokenMetadata() {
  initFetchListOfSampleTokens().then((sampleTokens) => {
    fetchTokenMetadata(0, sampleTokens);
  });
}

/**
 *
 * @param {*} tokenIndex = "firstSelectedToken" or "secondSelectedToken
 */
function $fetchTokenBalance(tokenIndex) {
  const tokenSymbol = state[tokenIndex].symbol;
  const address = state.tokenRecords[tokenSymbol].address;
  getTokenBalanceOfUser(address).then((balance) => {
    const formattedBalance = balance / 1e24;
    const newTokenInfo = { ...state[tokenIndex], balance: formattedBalance };
    State.update({
      [tokenIndex]: newTokenInfo,
    });
  });
}

const $getPoolTokens = (firstTokenAddress, secondTokenAddress) => {
  return Near.asyncView("factory2.zswap.testnet", "get_pool", {
    token_0: firstTokenAddress,
    token_1: secondTokenAddress,
    fee: 3000,
  });
};

const $getPriceSqrtX96 = (poolId) => {
  return Near.asyncView(poolId, "get_slot_0", {});
};

/** Static variables */

/** Handle events  */
const onChange = (e) => {
  if (e.target.value === "") {
    State.update({
      firstSelectedToken: { ...state.firstSelectedToken, amount: "" },
      secondSelectedToken: { ...state.secondSelectedToken, amount: "" },
    });
    return;
  }
  if (state.firstSelectedToken.symbol === "") {
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        inputError: "Please select token",
      },
    });
    return;
  }

  if (state.secondSelectedToken.symbol === "") {
    State.update({
      secondSelectedToken: {
        ...state.secondSelectedToken,
        inputError: "Please select token",
      },
    });
    return;
  }

  if (isNaN(e.target.value)) {
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        inputError: "Invalid input",
      },
    });
    return;
  }
  if (e.target.value < 0) {
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        inputError: "Invalid input",
      },
    });
    return;
  }

  if (e.target.value > state.firstSelectedToken.balance) {
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        inputError: "Insufficient balance",
      },
    });
    return;
  }

  State.update({
    firstSelectedToken: { ...state.firstSelectedToken, amount: e.target.value },
  });

  const secondAmount = Big(e.target.value).mul(state.currentPrice).toFixed();
  State.update({
    secondSelectedToken: {
      ...state.secondSelectedToken,
      amount: secondAmount,
    },
  });
};

const onClickMax = () => {
  State.update({
    firstSelectedToken: {
      ...state.firstSelectedToken,
      amount: state.firstSelectedToken.balance,
    },
  });
};

const onFirstTokenChange = (token) => {
  State.update({
    firstSelectedToken: { ...state.firstSelectedToken, symbol: token },
  });
  $fetchTokenBalance("firstSelectedToken");
  const firstTokenAddress = state.tokenRecords[token].address;
  if (state.secondSelectedToken.symbol === "") {
    return;
  }
  const secondTokenAddress =
    state.tokenRecords[state.secondTokenAddress.symbol].address;
  $getPoolTokens(firstTokenAddress, secondTokenAddress).then((poolMetadata) => {
    State.update({
      poolId: poolMetadata.pool_id,
    });
  });
};

const onSecondTokenChange = (token) => {
  State.update({
    secondSelectedToken: { ...state.secondSelectedToken, symbol: token },
  });
  $fetchTokenBalance("firstSelectedToken");
  if (state.firstSelectedToken.symbol === "") {
    return;
  }

  const firstTokenAddress =
    state.tokenRecords?.[state.firstSelectedToken.symbol]?.address;
  const secondTokenAddress = state.tokenRecords?.[token]?.address;

  $getPoolTokens(firstTokenAddress, secondTokenAddress).then((poolMetadata) => {
    State.update({
      poolId: poolMetadata.pool_id,
    });

    $getPriceSqrtX96(poolMetadata.pool_id).then((res) => {
      const price =
        secondTokenAddress === poolMetadata.token_1
          ? Big(res.sqrt_price_x96).div(Big(2).pow(96)).pow(2)
          : Big(1).div(Big(res.sqrt_price_x96).div(Big(2).pow(96)).pow(2));

      State.update({
        currentPrice: price,
      });
    });
  });
};

const handleSwap = () => {
  //   $ ZNEAR_AMOUNT=100

  // $ SWAP_MSG='{\"swap_single\":{\"token_out\":\"'$ZUSD'\",\"fee\":3000}}'

  // $ near call $ZNEAR ft_transfer_call '{"receiver_id":"'$ZSWAP_MANAGER'", "amount":"'$ZNEAR_AMOUNT'", "msg":"'$SWAP_MSG'"}' --gas 300000000000000 --accountId $TRADER --depositYocto 1

  const firsTokenAddress =
    state.tokenRecords[state.firstSelectedToken.symbol].address;
  const secondTokenAddress =
    state.tokenRecords[state.secondSelectedToken.symbol].address;
  Near.call(
    firsTokenAddress,
    "ft_transfer_call",
    {
      receiver_id: "manager.zswap.testnet",
      amount: Big(state.firstSelectedToken.amount).mul(1e24).toFixed(),
      msg: JSON.stringify({
        swap_single: {
          token_out: secondTokenAddress,
          fee: 3000,
        },
      }),
    },
    300000000000000,
    1
  );
};

/** Call function */
if (!state.firstFetchedFlag) {
  $fetchTokenMetadata();
  State.update({
    firstFetchedFlag: true,
  });
}

const listToken = Object.entries(state.tokenRecords)
  .map(([_, token]) => {
    return {
      symbol: token.symbol,
      icon: token.icon,
    };
  })
  .reverse();

return (
  <SwapWrapper>
    <Container>
      <Widget
        src={`${props?.config.ownerId}/widget/ZSwap.Element.Input`}
        props={{
          config: props?.config,
          label: "You send",
          value: state.firstSelectedToken.amount,
          inputError: state.firstSelectedToken.inputError,
          balance: state.firstSelectedToken.balance,
          selectedToken: state.firstSelectedToken.symbol,
          listToken: listToken,
          showBalance: true,
          onChange: onChange,
          onClickMax: onClickMax,
          onChangeToken: onFirstTokenChange,
          selectPosition: {
            bottom: "calc(100% + 10px)",
          },
        }}
      />
      <Widget
        src={`${props?.config.ownerId}/widget/ZSwap.Element.Input`}
        props={{
          config: props?.config,
          label: "You receive",
          value: state.secondSelectedToken.amount,
          inputError: state.secondSelectedToken.inputError,
          selectedToken: state.secondSelectedToken.symbol,
          listToken: listToken,
          showBalance: false,
          onClickMax: onClickMax,
          onChangeToken: onSecondTokenChange,
          selectPosition: {
            bottom: "calc(100% + 10px)",
          },
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
    <Container>
      <Button width={"40%"} onClick={() => handleSwap()}>
        Swap
      </Button>
    </Container>
  </SwapWrapper>
);
