/** Constants */
const NEAR_DECIMALS = 24;
const BIG_ROUND_DOWN = 0;
const BIG_ROUND_UP = 3;
const fee_descriptions = [
  // [0.01, "very stable pairs", 32],
  [0.05, "stable pairs", 0],
  [0.3, "most pairs", 0],
  // [0.1, "exotic pairs", 0],
];
// Define components
const MIN_TICK = -887272;
const MAX_TICK = 887272;

const MIN_PRICE = Math.pow(1.0001, MIN_TICK);
const MAX_PRICE = Math.pow(1.0001, MAX_TICK);
const TOKEN_SUFFIX = ".zswap.testnet";
const ZSWAP_MANAGER = "manager3.zswap.testnet";
const ZSWAP_FACTORY = "factory3.zswap.testnet";
const DEFAULT_SQRT_PRICE_X96 = "792281625142643375935439503360";
const DEFAULT_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";
/** State */
State.init({
  firstSelectedToken: {
    symbol: "",
    amount: "",
    priceInUSD: 0,
    balance: 0,
  },
  secondSelectedToken: {
    symbol: "",
    amount: "",
    priceInUSD: 0,
    balance: 0,
  },
  priceRange: {
    lowPrice: "",
    highPrice: "",
  },
  customTokenInput: {
    firstTokenAddress: "",
    secondTokenAddress: "",
  },
  TOKENS: {},
  fetchedTokensList: false,
  inputError: "",
  show_fee_choices: false,
  fee_chosen: 1,
});

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

const TOKEN_ACCOUNTS = ["zusd.zswap.testnet", "znear.zswap.testnet"];
const poolMetadata =
  state.firstSelectedToken.symbol && state.secondSelectedToken.symbol
    ? Near.view(ZSWAP_FACTORY, "get_pool", {
        token_0: state.TOKENS[state.firstSelectedToken.symbol]?.address ?? "",
        token_1: state.TOKENS[state.secondSelectedToken.symbol]?.address ?? "",
        fee: fee_descriptions[state.fee_chosen][0] * Math.pow(10, 4),
      })
    : undefined;

const provideLiquidityOnExistingPool =
  poolMetadata ||
  !state.firstSelectedToken.symbol ||
  !state.secondSelectedToken.symbol;

function encodePriceSqrt(reserve1, reserve0) {
  return Math.flow(Math.sqrt(reserve1 / reserve0) * Math.pow(2, 96));
}
// function decodePriceSqrt(sqrtPriceX96Big) {
//   const price = sqrtPriceX96Big.div(Big(2).pow(96));
//   return price;
// }

const currentSqrtX96PriceBig = poolMetadata
  ? Big(
      Near.view(poolMetadata.pool_id, "get_slot_0", {})?.sqrt_price_x96 ?? "0"
    )
  : Big(0);

const currentPriceBig =
  poolMetadata && !currentSqrtX96PriceBig.eq(Big(0))
    ? poolMetadata.token_0.startsWith(
        state.firstSelectedToken.symbol.toLowerCase()
      )
      ? currentSqrtX96PriceBig.div(Big(2).pow(96)).pow(2)
      : Big(1).div(currentSqrtX96PriceBig.div(Big(2).pow(96)).pow(2))
    : Big(0);

console.log("Pool metadata: ", poolMetadata, currentSqrtX96PriceBig.toFixed());
// console.log(
//   `Current price (token0/token1): ${currentPriceBig.toFixed()}`,
//   currentPriceBig
// );

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

const refetchTokenMetadata = (address) => {
  return Near.asyncView(address, "ft_metadata", {}).then((tokenMetadata) => {
    State.update({
      TOKENS: {
        ...state.TOKENS,
        [tokenMetadata.symbol]: {
          ...tokenMetadata,
          address: tokenAddress,
          priceInUSD: 0,
          address: address,
          priceInUSD: -1,
          icon: tokenMetadata?.icon ?? DEFAULT_LOGO,
          logo: tokenMetadata?.icon ?? DEFAULT_LOGO,
        },
      },
    });
    return tokenMetadata.symbol;
  });
};
if (!state.fetchedTokensList) {
  State.update({
    fetchedTokensList: true,
  });
  $fetchTokenMetadata();
}

/** Static variables */
const { config } = props;
if (!config) {
  return "Component cannot be loaded. Missing `config` props";
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  //wrapper-height
  min-height: 500px;
  padding: 40px;
  border-radius: 10px;
  //shadow-xl
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  color: black;
`;

const DialogWrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 2px solid #2bcc91;
  background-color: white;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
`;
const DialogBody = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 20px 0 20px;
  & > div {
    flex: 1;
    padding: 8px;
  }
`;

const Section = styled.div`
  flex: 1;
`;

const Horizontal = styled.hr`
  width: 100%;
  background: #2bcc91;
  border: 0;
  height: 1px;
  border-radius: 9999px;
`;

const ArrowWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #2BCC91
  &:hover {
    opacity: 0.9;
    color: #000;
  }
`;

const Label = styled.div`
  padding: 8px;
  display: flex;
  justify-content: ${(props) => props.justifyContent || "center"};
  font-size: ${(props) => props.fontSize + "px" || "20px"};
  font-weight: bold;
`;

const connectWallet =
  props.connectWallet ||
  (() => {
    return true;
  });

const getPriceOfTokenIfNeeded = (token) => {
  if (!token) return;
  if (state.TOKENS[token].priceInUSD < 0) {
    return 0;
    console.log("Start fetching price for " + token + "...");
    asyncFetch(
      "https://api.unmarshal.com/v1/pricestore/" +
        token +
        "?auth_key=9v0mXZlpj27qoEmabpGJ8amEICsKmRWl6KgVnCOs"
    ).then((res) => {
      try {
        const price = Number(res.body[0].price);
        State.update({
          TOKENS: {
            ...state.TOKENS,
            [token]: {
              ...state.TOKENS[token],
              priceInUSD: price,
            },
          },
        });

        console.log("Price of " + token + " is ", price);

        // trigger re-rendering
        State.update({
          firstSelectedToken: {
            ...state.firstSelectedToken,
            priceInUSD:
              token == state.firstSelectedToken.symbol
                ? price
                : state.firstSelectedToken.priceInUSD,
          },
          secondSelectedToken: {
            ...state.secondSelectedToken,
            priceInUSD:
              token == state.secondSelectedToken.symbol
                ? price
                : state.secondSelectedToken.priceInUSD,
          },
        });
      } catch (err) {
        console.log("Fail here ", err);
      }
    });
  } else {
    const price = state.TOKENS[token].priceInUSD;
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        priceInUSD:
          token == state.firstSelectedToken.symbol
            ? price
            : state.firstSelectedToken.priceInUSD,
      },
      secondSelectedToken: {
        ...state.secondSelectedToken,
        priceInUSD:
          token == state.secondSelectedToken.symbol
            ? price
            : state.secondSelectedToken.priceInUSD,
      },
    });
  }
};

const getTokenBalanceOfUser = (token) => {
  return Near.asyncView(state.TOKENS[token].address, "ft_balance_of", {
    account_id: ACCOUNT_ID,
  })
    .catch((err) => 0)
    .then((bl) => {
      console.log("User has ", bl, " ", token);
      return Big(bl)
        .div(Big(Math.pow(10, 24)))
        .toNumber();
    })
    .then((bl) => (Number.isNaN(bl) ? 0 : bl));
};

const updateSelectedData = () => {
  getPriceOfTokenIfNeeded(state.firstSelectedToken.symbol);
  getPriceOfTokenIfNeeded(state.secondSelectedToken.symbol);
  getTokenBalanceOfUser(state.firstSelectedToken.symbol).then((balance) => {
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        balance: balance ?? 0,
      },
    });
  });
  getTokenBalanceOfUser(state.secondSelectedToken.symbol).then((balance) => {
    State.update({
      secondSelectedToken: {
        ...state.secondSelectedToken,
        balance: balance ?? 0,
      },
    });
  });
};
const onFirstTokenChange = (token) => {
  let prevFirst = state.firstSelectedToken.symbol;

  State.update({
    firstSelectedToken: {
      ...state.firstSelectedToken,
      symbol: token,
      amount: 0,
      balance: 0,
    },
    ...(token === state.secondSelectedToken.symbol && {
      secondSelectedToken: {
        ...state.secondSelectedToken,
        symbol: prevFirst,
        amount: 0,
        balance: 0,
      },
    }),
  });

  updateSelectedData();
};

const onSecondTokenChange = (token) => {
  let prevSecond = state.secondSelectedToken.symbol;

  State.update({
    secondSelectedToken: {
      ...state.secondSelectedToken,
      symbol: token,
      amount: 0,
      balance: 0,
    },
    ...(token === state.firstSelectedToken.symbol && {
      firstSelectedToken: {
        ...state.firstSelectedToken,
        symbol: prevSecond,
        amount: 0,
        balance: 0,
      },
    }),
  });

  updateSelectedData();
};

/////////////////////////////////////////////////////////////////////////////////
const ChooseFeeWrapper = styled.div`
  .fee_choices_container {
    display: flex;
    gap: 8px;
  }
  .fee_choice {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 8px;
    cursor: pointer;
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 /0.05);
  }

  .fee_choice_chosen {
    border: 1px solid #2dcc91;
  }
  .fee_choice:hover {
    border: 1px solid #2dcc91;
  }

  .fee_choice .top {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .fee_choice .top .tick_circle {
    background: #2dcc91;
    width: 17px;
    height: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  .fee_choice .mid {
    font-size: 12px;
    color: rgb(119, 128, 160);
  }

  .fee_choice .bottom {
    background: rgb(0 0 0 /0.05);
    border: unset;
    border-radius: 0.5rem;
    color: rgb(0, 0, 0);
    padding: 4px 6px;
    font-weight: 500;
    font-size: 10px;
    width: max-content;
  }

  .fee_input_container {
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(0 0 0 /0.05);
    padding: 1rem;
    border-radius: 16px;
    margin-bottom: 12px;
    margin-top: 12px;
  }
  .fee_input_container .fee_info {
    display: flex;
    flex-direction: column;
  }
  .fee_input_container .fee_info .fee_tier {
    color: rgb(13, 17, 28);
    font-weight: 600;
  }

  .fee_input_container .fee_info .percent_select {
    background: rgb(0 0 0 /0.05);
    border: unset;
    border-radius: 0.5rem;
    color: rgb(0, 0, 0);
    padding: 4px 6px;
    font-weight: 500;
    font-size: 10px;
    width: max-content;
  }

  .fee_input_container .toggle_fee_choices {
    color: rgb(119, 128, 160);
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    height: revert;
    justify-content: center;
    cursor: pointer;
  }
`;

const ChooseFeeForm = (
  <ChooseFeeWrapper>
    <div class="fee_input_container">
      <div class="fee_info">
        <div class="fee_tier">
          {fee_descriptions[state.fee_chosen][0]}% fee tier
        </div>
        <div class="percent_select">
          {fee_descriptions[state.fee_chosen][2]}% select
        </div>
      </div>
      <div
        class="toggle_fee_choices"
        onClick={() => {
          State.update({ show_fee_choices: !state.show_fee_choices });
        }}
        style={{
          color: "#4338ca",
        }}
      >
        {state.show_fee_choices ? "Hide" : "Show"}
      </div>
    </div>

    {state.show_fee_choices && (
      <div class="fee_choices_container">
        {fee_descriptions.map((fee, i) => (
          <div
            class={
              state.fee_chosen == i
                ? "fee_choice fee_choice_chosen"
                : "fee_choice"
            }
            onClick={() => State.update({ fee_chosen: i })}
          >
            <div class="top">
              <div>{fee[0]}%</div>
              <div class="tick_circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <div class="mid">Best for {fee[1]} pairs</div>
            <div class="bottom">
              <div>{fee[2]}% select</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </ChooseFeeWrapper>
);

const ChooseDepositAmountWrapper = styled.div`
  .amount_input_container {
    border-radius: 20px;
    border: 1px solid rgb(255, 255, 255);
    background-color: rgb(245, 246, 252);
    margin-top: 8px;
    padding: 1rem 1rem 0.75rem;
  }

  .top_row {
    display: flex;
    justify-content: space-between;
  }
  .bottom_row {
    display: flex;
    justify-content: space-between;
  }
  .amount_input_container:hover {
    border: 1px solid rgb(184, 192, 220);
  }

  .amount_input {
    width: 100%;
    transition: opacity 0.2s ease-in-out 0s;
    text-align: left;
    color: rgb(13, 17, 28);
    font-weight: 400;
    outline: none;
    border: medium;
    flex: 1 1 auto;
    background-color: transparent;
    font-size: 28px;
    white-space: nowrap;
    text-overflow: ellipsis;
    appearance: textfield;
    padding: 0;
  }

  .usd_valuation {
    box-sizing: border-box;
    font-weight: 400;
    font-size: 14px;
    color: rgb(119, 128, 160);
  }

  .top_row .token_name {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(0 0 0 /0.05);
    color: rgb(13, 17, 28);
    cursor: pointer;
    border-radius: 16px;
    outline: none;
    user-select: none;
    border: medium;
    font-size: 24px;
    font-weight: 500;
    height: 2.4rem;
    width: initial;
    padding: 0px 8px;
    margin-bottom: 8px;
    margin-left: 12px;
    font-size: 20px;
  }

  .top_row .token_name img {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
  .bottom_row .balance_container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .bottom_row .balance_container .balance {
    font-weight: 500;
    font-size: 14px;
  }
  .bottom_row.balance_container.max_balance_btn: hover {
    opacity: 0.8;
  }
  .bottom_row .balance_container .max_balance_btn {
    background-color: rgb(21, 213, 143);
    border: medium;
    border-radius: 12px;
    color: white;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    margin-left: 0.25rem;
    opacity: 1;
    padding: 4px 6px;
    pointer-events: initial;
  }
  .deposit_token_btn {
    width: 100%;
    position: relative;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    background-color: rgb(43, 204, 145);
    color: white;
    border-radius: 10px;
    font-weight: bold;
    overflow: hidden;
    padding: 4px 0px;
    margin-top: 12px;
    cursor: pointer;
    border: none;
  }
  .deposit_token_btn.disabled {
    background: #8bf1cc;
  }
`;

const getLog = (num, base) => {
  return Math.log(num) / Math.log(base);
};
const getLowerTick = (lowPrice) => {
  // poolMetadata must be non-empty
  const price = Big(lowPrice);
  if (price.lte(0)) return Big(-1);

  const tick_spacing = Big(poolMetadata.tick_spacing);

  // console.log("now ", lowPrice, price, tick_spacing);
  let lower_tick = Big(Math.floor(getLog(price.toNumber(), 1.0001)));

  // console.log(
  //   "sure ",
  //   lowPrice,
  //   " ",
  //   price.toFixed(),
  //   " ",
  //   tick_spacing.toFixed(),
  //   " ",
  //   lower_tick.toFixed(),
  //   " //// ",
  //   lower_tick.toNumber()
  // );
  let i = 0;
  while (
    i < 10 &&
    lower_tick.lt(Big(MAX_TICK)) &&
    (Big(Math.pow(1.0001, lower_tick.toNumber())).lt(price) ||
      !lower_tick.mod(tick_spacing).eq(Big(0)))
  ) {
    // console.log("wrong ", lower_tick.toFixed(), " / ");

    lower_tick = lower_tick
      .plus(tick_spacing)
      .div(tick_spacing)
      .round(undefined, BIG_ROUND_DOWN)
      .mul(tick_spacing);

    i += 1;
  }
  if (
    Big(Math.pow(1.0001, lower_tick.toNumber())).gte(price) &&
    lower_tick.mod(tick_spacing).eq(Big(0))
  ) {
    return lower_tick;
  } else {
    return Big(-1);
  }
};

const getUpperTick = (highPrice) => {
  // poolMetadata must be non-empty
  const price = Big(highPrice);
  const tick_spacing = Big(poolMetadata.tick_spacing);
  if (price.lte(0)) return Big(-1);

  let upper_tick = Big(Math.ceil(getLog(price.toNumber(), 1.0001)));

  // console.log(
  //   "upper => ",
  //   upper_tick.toFixed(),
  //   " / ",
  //   price.toFixed(),
  //   " / ",
  //   tick_spacing.toFixed()
  // );
  while (
    upper_tick.gt(MIN_TICK) &&
    (Big(Math.pow(1.0001, upper_tick.toNumber())).gt(price) ||
      !upper_tick.mod(tick_spacing).eq(Big(0)))
  ) {
    // console.log("wrong ", upper_tick.toFixed(), " => ");
    upper_tick = upper_tick
      .minus(tick_spacing)
      .div(tick_spacing)
      .round(undefined, BIG_ROUND_UP)
      .mul(tick_spacing);
  }
  if (
    Big(Math.pow(1.0001, upper_tick.toNumber())).lte(price) &&
    upper_tick.mod(tick_spacing).eq(0)
  ) {
    return upper_tick;
  } else {
    return Big(-1);
  }
};

const updateAmount1BasedOnAmount0 = () => {
  const amount = state.firstSelectedToken.amount;

  if (!amount || !Number(amount)) {
    State.update({
      secondSelectedToken: {
        ...state.secondSelectedToken,
        amount: "0",
      },
    });
    return;
  }

  if (!state.priceRange.lowPrice.length || !state.priceRange.highPrice.length)
    return;
  const isReversedDirection =
    poolMetadata &&
    !poolMetadata.token_0.startsWith(
      state.firstSelectedToken.symbol.toLowerCase()
    );
  const lower_tick = isReversedDirection
    ? getLowerTick(
        Big(1).div(Big(state.priceRange.highPrice)).toString()
      ).toNumber()
    : getLowerTick(state.priceRange.lowPrice).toNumber();
  const upper_tick = isReversedDirection
    ? getUpperTick(
        Big(1).div(Big(state.priceRange.lowPrice)).toString()
      ).toNumber()
    : getUpperTick(state.priceRange.highPrice).toNumber();

  if (poolMetadata)
    Near.asyncView(
      ZSWAP_MANAGER,
      isReversedDirection
        ? "calculate_amount_0_with_amount_1"
        : "calculate_amount_1_with_amount_0",
      {
        [isReversedDirection ? "amount_1" : "amount_0"]: Big(amount)
          .mul(Big(Math.pow(10, 24)))
          .round(undefined, BIG_ROUND_DOWN)
          .toFixed(),
        sqrt_price_x96: currentSqrtX96PriceBig.toFixed(),
        lower_tick,
        upper_tick,
      }
    ).then((amount1Str) => {
      const amount1 = Big(amount1Str)
        .div(Big(Math.pow(10, 24)))
        .round(10, BIG_ROUND_UP);
      State.update({
        secondSelectedToken: {
          ...state.secondSelectedToken,
          amount: amount1.toString(),
        },
      });
    });
};

const updateAmount0BasedOnAmount1 = () => {
  const amount = state.secondSelectedToken.amount;

  if (!amount || !Number(amount)) {
    State.update({
      firstSelectedToken: {
        ...state.firstSelectedToken,
        amount: "0",
      },
    });
    return;
  }

  if (!state.priceRange.lowPrice.length || !state.priceRange.highPrice.length)
    return;
  const isReversedDirection =
    poolMetadata &&
    !poolMetadata.token_0.startsWith(
      state.firstSelectedToken.symbol.toLowerCase()
    );
  const lower_tick = isReversedDirection
    ? getLowerTick(
        Big(1).div(Big(state.priceRange.highPrice)).toString()
      ).toNumber()
    : getLowerTick(state.priceRange.lowPrice).toNumber();
  const upper_tick = isReversedDirection
    ? getUpperTick(
        Big(1).div(Big(state.priceRange.lowPrice)).toString()
      ).toNumber()
    : getUpperTick(state.priceRange.highPrice).toNumber();

  if (poolMetadata)
    Near.asyncView(
      ZSWAP_MANAGER,
      isReversedDirection
        ? "calculate_amount_1_with_amount_0"
        : "calculate_amount_0_with_amount_1",
      {
        [isReversedDirection ? "amount_0" : "amount_1"]: Big(amount)
          .mul(Big(Math.pow(10, 24)))
          .round(undefined, BIG_ROUND_DOWN)
          .toFixed(),
        sqrt_price_x96: currentSqrtX96PriceBig.toFixed(),
        lower_tick,
        upper_tick,
      }
    ).then((amount0Str) => {
      const amount0 = Big(amount0Str)
        .div(Big(Math.pow(10, 24)))
        .round(10, BIG_ROUND_UP);
      console.log("amount0 = ", amount0);
      State.update({
        firstSelectedToken: {
          ...state.firstSelectedToken,
          amount: amount0.toString(),
        },
      });
    });
};

const depositFirstToken = () => {
  Near.call(
    state.TOKENS[state.firstSelectedToken.symbol].address,
    "ft_transfer_call",
    {
      receiver_id: poolMetadata.pool_id,
      amount: Big(state.firstSelectedToken.amount)
        .mul(Big(Math.pow(10, 24)))
        .toFixed(),
      msg: DEPOSIT_MSG,
    },
    300000000000000,
    1
  );
};
const depositSecondToken = () => {
  Near.call(
    state.TOKENS[state.secondSelectedToken.symbol].address,
    "ft_transfer_call",
    {
      receiver_id: poolMetadata.pool_id,
      amount: Big(state.secondSelectedToken.amount)
        .mul(Big(Math.pow(10, 24)))
        .toFixed(),
      msg: DEPOSIT_MSG,
    },
    300000000000000,
    1
  );
};

const notEnoughAmount0 =
  state.firstSelectedToken.symbol &&
  Number(state.firstSelectedToken.amount) >
    Number(state.firstSelectedToken.balance);
const notEnoughAmount1 =
  state.secondSelectedToken.symbol &&
  Number(state.secondSelectedToken.amount) >
    Number(state.secondSelectedToken.balance);
const canProvideLiquidity =
  (Number(state.firstSelectedToken.amount) > 0 ||
    Number(state.secondSelectedToken.amount) > 0) &&
  !notEnoughAmount0 &&
  !notEnoughAmount1;
const canCreatePool =
  !poolMetadata &&
  state.firstSelectedToken.symbol &&
  state.secondSelectedToken.symbol;

const canDeposit =
  (Number(state.firstSelectedToken.amount) ||
    Number(state.secondSelectedToken.amount)) &&
  !notEnoughAmount0 &&
  !notEnoughAmount1 &&
  state.priceRange.lowPrice &&
  state.priceRange.highPrice;

const ChooseDepositAmount = (
  <ChooseDepositAmountWrapper>
    <Label fontSize={18} justifyContent={"flex-start"}>
      Deposit Amounts
    </Label>
    <div class="amount_input_container">
      <div class="top_row">
        <input
          class="amount_input"
          inputmode="decimal"
          autocomplete="off"
          autocorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0"
          minlength="1"
          maxlength="20"
          spellcheck="false"
          value={state.firstSelectedToken.amount}
          onChange={(e) => {
            const amount = e.target.value;
            if (!amount || amount.match(/^\d{1,}(\.\d{0,20})?$/)) {
              State.update({
                firstSelectedToken: {
                  ...state.firstSelectedToken,
                  amount,
                },
              });

              updateAmount1BasedOnAmount0();
            }
          }}
        />
        {state.firstSelectedToken.symbol && (
          <div class="token_name">
            <img
              src={state.TOKENS[state.firstSelectedToken.symbol].icon}
              width={24}
              height={24}
              alt={state.firstSelectedToken.symbol}
            />
            {state.firstSelectedToken.symbol}
          </div>
        )}
      </div>
      <div class="bottom_row">
        <div class="usd_valuation">
          {state.firstSelectedToken.symbol ? (
            <>
              $
              {Number(state.firstSelectedToken.amount) *
                state.firstSelectedToken.priceInUSD}
            </>
          ) : (
            "-"
          )}
        </div>
        <div class="balance_container">
          <div class="balance">Balance: {state.firstSelectedToken.balance}</div>
          <div
            class="max_balance_btn"
            onClick={() => {
              State.update({
                firstSelectedToken: {
                  ...state.firstSelectedToken,
                  amount: state.firstSelectedToken.balance.toString(),
                },
              });
              updateAmount1BasedOnAmount0();
            }}
          >
            MAX
          </div>
        </div>
      </div>
      {canDeposit ? (
        <button class="deposit_token_btn" onClick={depositFirstToken}>
          Deposit
        </button>
      ) : (
        <button class="deposit_token_btn disabled">Deposit</button>
      )}
    </div>

    <div class="amount_input_container">
      <div class="top_row">
        <input
          class="amount_input"
          inputmode="decimal"
          autocomplete="off"
          autocorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0"
          minlength="1"
          maxlength="20"
          spellcheck="false"
          value={state.secondSelectedToken.amount}
          onChange={(e) => {
            const amount = e.target.value;
            if (!amount || amount.match(/^\d{1,}(\.\d{0,20})?$/)) {
              State.update({
                secondSelectedToken: {
                  ...state.secondSelectedToken,
                  amount,
                },
              });
              updateAmount0BasedOnAmount1();
            }
          }}
        />
        {state.secondSelectedToken.symbol && (
          <div class="token_name">
            <img
              src={state.TOKENS[state.secondSelectedToken.symbol].icon}
              width={24}
              height={24}
              alt={state.secondSelectedToken.symbol}
            />
            {state.secondSelectedToken.symbol}
          </div>
        )}
      </div>
      <div class="bottom_row">
        <div class="usd_valuation">
          {state.secondSelectedToken.symbol ? (
            <>
              $
              {state.secondSelectedToken.amount *
                state.secondSelectedToken.priceInUSD}
            </>
          ) : (
            "-"
          )}
        </div>
        <div class="balance_container">
          <div class="balance">
            Balance: {state.secondSelectedToken.balance}
          </div>
          <div
            class="max_balance_btn"
            onClick={() => {
              State.update({
                secondSelectedToken: {
                  ...state.secondSelectedToken,
                  amount: state.secondSelectedToken.balance.toString(),
                },
              });
              updateAmount0BasedOnAmount1();
            }}
          >
            MAX
          </div>
        </div>
      </div>
      {canDeposit ? (
        <button class="deposit_token_btn" onClick={depositSecondToken}>
          Deposit
        </button>
      ) : (
        <button class="deposit_token_btn disabled">Deposit</button>
      )}
    </div>
  </ChooseDepositAmountWrapper>
);

/////////////////////////////////////////////////////////////////////////////////

const ChoosePriceRangeWrapper = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header .full_range_btn {
    background-color: transparent;
    padding: 6px;
    text-align: center;
    border-radius: 8px;
    color: rgb(13, 17, 28);
    cursor: pointer;
    border: 1px solid rgb(0 0 0 /0.05);
    font-weight: 400;
    font-size: 12px;
  }

  .header .full_range_btn:hover {
    box-shadow: rgb(152, 161, 192) 0px 0px 0px 1px;
  }
  .current_price {
    font-size: 14px;
    color: rgb(119, 128, 160);
    padding: 0 0 8px 8px;
  }
  .current_price .price {
    font-weight: bold;
  }
  .price_choices_container {
    max-width: 500px;
  }

  .price_choices_container .price_choice {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    padding: 12px;
    cursor: pointer;
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 /0.05);
  }

  .price_choices_container .price_choice:focus,
  .price_choices_container .price_choice:focus-within,
  .price_choices_container .price_choice:target {
    border-color: #2bcc91;
  }

  .price_choice .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price_choice .top .price_label {
    font-size: 12px;
    text-align: center;
    color: rgb(119, 128, 160);
  }

  .price_choice .price_notation_label {
    min-width: 0px;
    font-size: 12px;
    text-align: center;
    color: rgb(119, 128, 160);
  }

  .price_choice .mid {
    display: flex;
    width: 100%;
  }

  .price_choice .mid .price_input {
    font-weight: 500;
    padding: 0px 10px;
    color: rgb(13, 17, 28);
    width: 0px;
    font-weight: 400;
    outline: none;
    border: medium;
    flex: 1 1 auto;
    background-color: transparent;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    appearance: textfield;
    font-size: 20px;
  }

  .price_adjust_btn {
    color: rgb(13, 17, 28) !important;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .price_adjust_btn:hover {
    background: rgb(210, 218, 247);
    border-radius: 8px;
  }

  .price_choice .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
const ChoosePriceRangeForm = (
  <ChoosePriceRangeWrapper>
    <div class="header">
      <Label fontSize={18} justifyContent={"flex-start"}>
        Select price range
      </Label>
      <div
        class="full_range_btn"
        onClick={() => {
          State.update({
            priceRange: { lowPrice: 0, highPrice: MAX_PRICE },
          });
        }}
      >
        Full range
      </div>
    </div>
    {state.firstSelectedToken.symbol && state.secondSelectedToken.symbol && (
      <div class="current_price">
        {poolMetadata ? (
          <>
            Current price:{" "}
            <span
              class="price"
              style={{
                fontSize: "20px",
                color: "#4338ca",
                fontWeight: 700,
              }}
            >
              {currentPriceBig.round(10).toString()}
            </span>
          </>
        ) : (
          "Pool not created"
        )}
      </div>
    )}
    <div class="price_choices_container">
      <div class="price_choice">
        <div class="top">
          <div class="price_label">Min Price</div>
          <div
            class="price_adjust_btn plus"
            onClick={() => {
              const prevLowPrice = Number(state.priceRange.lowPrice);
              State.update({
                priceRange: {
                  ...state.priceRange,
                  lowPrice:
                    prevLowPrice <= MAX_PRICE - 1
                      ? (prevLowPrice + 1).toString()
                      : state.price.lowPrice,
                },
              });

              updateAmount1BasedOnAmount0();
            }}
          >
            +
          </div>
        </div>
        <div class="mid">
          <input
            class="price_input"
            inputmode="decimal"
            autocomplete="off"
            autocorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0"
            min={0}
            minlength="1"
            maxlength="20"
            spellcheck="false"
            value={state.priceRange.lowPrice}
            onChange={(e) => {
              const amount = e.target.value;
              if (!amount || amount.match(/^\d{1,}(\.\d{0,20})?$/)) {
                State.update({
                  priceRange: {
                    ...state.priceRange,
                    lowPrice: amount,
                  },
                });

                updateAmount1BasedOnAmount0();
              }
            }}
          />
        </div>
        <div class="bottom">
          <div class="price_notation_label">
            {state.firstSelectedToken.symbol &&
              state.secondSelectedToken.symbol &&
              state.secondSelectedToken.symbol +
                " per " +
                state.firstSelectedToken.symbol}
          </div>
          <div
            class="price_adjust_btn minus"
            onClick={() => {
              const prevLowPrice = Number(state.priceRange.lowPrice);
              State.update({
                priceRange: {
                  ...state.priceRange,
                  lowPrice:
                    prevLowPrice >= 1
                      ? (prevLowPrice - 1).toString()
                      : state.priceRange.lowPrice,
                },
              });
              updateAmount1BasedOnAmount0();
            }}
          >
            -
          </div>
        </div>
      </div>

      <div class="price_choice">
        <div class="top">
          <div class="price_label">Max Price</div>
          <div
            class="price_adjust_btn plus"
            onClick={() => {
              const prevHighPrice = Number(state.priceRange.highPrice);
              State.update({
                priceRange: {
                  ...state.priceRange,
                  highPrice:
                    prevHighPrice <= MAX_PRICE - 1
                      ? (prevHighPrice + 1).toString()
                      : state.priceRange.highPrice,
                },
              });
              updateAmount1BasedOnAmount0();
            }}
          >
            +
          </div>
        </div>
        <div class="mid">
          <input
            class="price_input"
            inputmode="decimal"
            autocomplete="off"
            autocorrect="off"
            type="text"
            pattern="^\d*(\.\d{0,20})?$"
            placeholder="0"
            minlength="1"
            max={MAX_PRICE}
            maxlength="20"
            spellcheck="false"
            value={state.priceRange.highPrice}
            onChange={(e) => {
              const amount = e.target.value;
              if (!amount || amount.match(/^\d{1,}(\.\d{0,20})?$/)) {
                State.update({
                  priceRange: {
                    ...state.priceRange,
                    highPrice: amount,
                  },
                });
                updateAmount1BasedOnAmount0();
              }
            }}
          />
        </div>
        <div class="bottom">
          <div class="price_notation_label">
            {state.firstSelectedToken.symbol &&
              state.secondSelectedToken.symbol &&
              state.secondSelectedToken.symbol +
                " per " +
                state.firstSelectedToken.symbol}
          </div>
          <div
            class="price_adjust_btn minus"
            onClick={() => {
              const prevHighPrice = Number(state.priceRange.highPrice);
              State.update({
                priceRange: {
                  ...state.priceRange,
                  highPrice:
                    prevHighPrice >= 1
                      ? (prevHighPrice - 1).toString()
                      : state.priceRange.highPrice,
                },
              });
              updateAmount1BasedOnAmount0();
            }}
          >
            -
          </div>
        </div>
      </div>
    </div>
  </ChoosePriceRangeWrapper>
);

/////////////////////////////////////////////////////////////////////////////////

const childSrc = context.networkId;

const NewPositionButton = (
  <Widget
    src={`${config.ownerId}/widget/ZSwap.Element.Button`}
    props={{
      onClick: () => {
        State.update({ showDialog: true });
      },
      text: (
        <span
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="white"
            width={16}
            height={16}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>{" "}
          <span>New position</span>
        </span>
      ),
      width: "180px",
      styles: {
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
        fontSize: "16px",
        color: "white",
      },
    }}
  />
);

const srcDocChart = `
<style>
#chartdiv {
  width: 100%;
  height: 500px;
}

</style>

<!-- Resources -->
<script src="https://cdn.amcharts.com/lib/4/core.js"></script>
<script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
<script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>

<!-- Chart code -->
<script>
window.top.postMessage("loaded", "*");
window.addEventListener("message", (event) => {
    const data = event.data
    const result = eval(data.exp);
    // event.source.postMessage(result, "*");
}, false);

am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
chart.data = generateChartData();

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "visits";
series.dataFields.dateX = "date";
series.strokeWidth = 1;
series.minBulletDistance = 10;
series.tooltipText = "{valueY}";
series.fillOpacity = 0.1;
series.tooltip.pointerOrientation = "vertical";
series.tooltip.getFillFromObject = false;
series.tooltip.background.fill = series.fill;


var seriesRange = dateAxis.createSeriesRange(series);
seriesRange.contents.strokeDasharray = "2,3";
seriesRange.contents.stroke = chart.colors.getIndex(8);
seriesRange.contents.strokeWidth = 1;

var pattern = new am4core.LinePattern();
pattern.rotation = -45;
pattern.stroke = seriesRange.contents.stroke;
pattern.width = 1000;
pattern.height = 1000;
pattern.gap = 6;
seriesRange.contents.fill = pattern;
seriesRange.contents.fillOpacity = 0.5;

// Add scrollbar
chart.scrollbarX = new am4core.Scrollbar();

// Cursor
chart.cursor = new am4charts.XYCursor();

function generateChartData() {
  var chartData = [];
  var firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 200);
  var visits = 1200;
  for (var i = 0; i < 200; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    var newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

    chartData.push({
      date: newDate,
      visits: visits
    });
  }
  return chartData;
}


// add range
var range = dateAxis.axisRanges.push(new am4charts.DateAxisDataItem());
range.grid.stroke = chart.colors.getIndex(0);
range.grid.strokeOpacity = 1;
range.bullet = new am4core.ResizeButton();
range.bullet.background.fill = chart.colors.getIndex(0);
range.bullet.background.states.copyFrom(chart.zoomOutButton.background.states);
range.bullet.minX = 0;
range.bullet.adapter.add("minY", function(minY, target) {
  target.maxY = chart.plotContainer.maxHeight;
  target.maxX = chart.plotContainer.maxWidth;
  return chart.plotContainer.maxHeight;
})

range.bullet.events.on("dragged", function() {
  range.value = dateAxis.xToValue(range.bullet.pixelX);
  seriesRange.value = range.value;
})


var firstTime = chart.data[0].date.getTime();
var lastTime = chart.data[chart.data.length - 1].date.getTime();
var date = new Date(firstTime + (lastTime - firstTime) / 2);

range.date = date;

seriesRange.date = date;
seriesRange.endDate = chart.data[chart.data.length - 1].date;


}); // end am4core.ready()
</script>

<!-- HTML -->
<div id="chartdiv"></div>
`;

const ErrorBoxWrapper = styled.div`
  .error {
    text-align: center;
    color: #dc3545;
    font-size: 20px;
    padding: 12px 0;
  }
`;

const ErrorBox = (
  <ErrorBoxWrapper>
    <div class="error">
      {notEnoughAmount0 ? (
        <>Oops! You don't have enough {state.firstSelectedToken.symbol}</>
      ) : (
        notEnoughAmount1 && (
          <>Oops! You don't have enough {state.secondSelectedToken.symbol}</>
        )
      )}
    </div>
  </ErrorBoxWrapper>
);

const createPool = () => {
  let token_0 = state.firstSelectedToken.symbol;
  let token_1 = state.secondSelectedToken.symbol;

  if (token_0 > token_1) {
    let tmp = token_0;
    token_0 = token_1;
    token_1 = tmp;
  }

  Near.call(
    ZSWAP_MANAGER,
    "create_pool",
    {
      token_0: state.TOKENS[token_0]?.address ?? token_0 + TOKEN_SUFFIX,
      token_1: state.TOKENS[token_1]?.address ?? token_1 + TOKEN_SUFFIX,
      fee: fee_descriptions[state.fee_chosen][0] * Math.pow(10, 4),
      sqrt_price_x96: DEFAULT_SQRT_PRICE_X96,
    },
    300000000000000,
    Math.pow(10, 23)
  );
};
const provideLiquidity = () => {
  const isReversedDirection =
    poolMetadata &&
    !poolMetadata.token_0.startsWith(
      state.firstSelectedToken.symbol.toLowerCase()
    );
  const lower_tick = isReversedDirection
    ? getLowerTick(
        Big(1).div(Big(state.priceRange.highPrice)).toString()
      ).toNumber()
    : getLowerTick(state.priceRange.lowPrice).toNumber();
  const upper_tick = isReversedDirection
    ? getUpperTick(
        Big(1).div(Big(state.priceRange.lowPrice)).toString()
      ).toNumber()
    : getUpperTick(state.priceRange.highPrice).toNumber();

  Near.call(
    ZSWAP_MANAGER,
    "mint",
    {
      params: {
        token_0: isReversedDirection
          ? state.TOKENS[state.secondSelectedToken.symbol].address
          : state.TOKENS[state.firstSelectedToken.symbol].address,
        token_1: isReversedDirection
          ? state.TOKENS[state.firstSelectedToken.symbol].address
          : state.TOKENS[state.secondSelectedToken.symbol].address,
        fee: fee_descriptions[state.fee_chosen][0] * Math.pow(10, 4),
        lower_tick,
        upper_tick,
        amount_0_desired: Big(
          isReversedDirection
            ? state.secondSelectedToken.amount
            : state.firstSelectedToken.amount
        )
          .mul(Big(Math.pow(10, 24)))
          .toFixed(),
        amount_1_desired: Big(
          isReversedDirection
            ? state.firstSelectedToken.amount
            : state.secondSelectedToken.amount
        )
          .mul(Big(Math.pow(10, 24)))
          .toFixed(),
        amount_0_min: "0",
        amount_1_min: "0",
      },
    },
    300000000000000,
    Math.pow(10, 23)
  );
};

const ProvideLiquidityButton = (
  <Widget
    src={`${config.ownerId}/widget/ZSwap.Element.Button`}
    props={{
      onClick: () => {
        if (canProvideLiquidity && provideLiquidityOnExistingPool) {
          provideLiquidity();
        } else if (canCreatePool && !provideLiquidityOnExistingPool) {
          createPool();
        }
      },
      text: provideLiquidityOnExistingPool
        ? "Provide liquidity"
        : "Create pool",
      styles: {
        width: "100%",
        color: "white",
      },
      background:
        canProvideLiquidity ||
        (canCreatePool && !provideLiquidityOnExistingPool)
          ? undefined
          : "#8bf1cc",
    }}
  />
);

const PoolDiaglog = (
  <>
    <DialogWrapper>
      <DialogHeader>
        <ArrowWrapper
          onClick={() => {
            State.update({ showDialog: false });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width={28}
            height={28}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
        </ArrowWrapper>
        <Label>Add liquidity</Label>
      </DialogHeader>
      <Horizontal />
      <DialogBody>
        <Section>
          <Label fontSize={18} justifyContent={"flex-start"}>
            Select Pair
          </Label>
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            <Widget
              src={`${config.ownerId}/widget/ZSwap.Element.CustomSelect`}
              props={{
                selectedItem: state.firstSelectedToken.symbol
                  ? state.firstSelectedToken.symbol
                  : "",
                list: ["ZNEAR", "ZUSD"]
                  .concat(
                    Object.keys(state.TOKENS).filter(
                      (x) => !["ZNEAR", "ZUSD"].includes(x.toUpperCase())
                    )
                  )
                  .map((symbol) => ({
                    value: symbol,
                    icon: state.TOKENS[symbol].icon,
                  })),
                onChangeItem: onFirstTokenChange,
                background: "rgb(245, 246, 252)",
                fontSize: "16px",
                // custom input
                enableCustomInput: true,
                onSubmitCustomInputValue: (address) => {
                  refetchTokenMetadata(address).then((symbol) => {
                    onFirstTokenChange(symbol);
                  });
                },
              }}
              style={{
                flex: 1,
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/ZSwap.Element.CustomSelect`}
              props={{
                selectedItem: state.secondSelectedToken.symbol
                  ? state.secondSelectedToken.symbol
                  : "",
                list: ["ZNEAR", "ZUSD"]
                  .concat(
                    Object.keys(state.TOKENS).filter(
                      (x) => !["ZNEAR", "ZUSD"].includes(x.toUpperCase())
                    )
                  )
                  .map((symbol) => ({
                    value: symbol,
                    icon: state.TOKENS[symbol].icon,
                  })),
                onChangeItem: onSecondTokenChange,
                background: "rgb(245, 246, 252)",
                fontSize: "16px",
                // custom input
                enableCustomInput: true,
                onSubmitCustomInputValue: (address) => {
                  refetchTokenMetadata(address).then((symbol) => {
                    onSecondTokenChange(symbol);
                  });
                },
              }}
              style={{
                flex: 1,
              }}
            />
          </div>
          {ChooseFeeForm}
          {ChooseDepositAmount}
        </Section>
        <Section>
          <div style={{}}>{ChoosePriceRangeForm}</div>
        </Section>
      </DialogBody>
      {/* {state.firstSelectedToken.symbol && state.secondSelectedToken.symbol && (
        <iframe
          className="border"
          style={{
            width: "100%",
            height: "525px",
          }}
          srcDoc={srcDocChart}
          message={{
            exp: state.text || "",
            currentPriceBig:
              state.firstSelectedToken.priceInUSD /
              (state.secondSelectedToken.priceInUSD ?? 0),
          }}
          onMessage={(res1) => State.update({ res1 })}
        />
      )} */}
      {ErrorBox}
      {ProvideLiquidityButton}
    </DialogWrapper>
  </>
);

return (
  <Main>
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      {connectWallet() &&
        (ACCOUNT_ID ? (
          !state.showDialog && NewPositionButton
        ) : (
          <Widget
            src={`${config.ownerId}/widget/ZSwap.Element.Button`}
            props={{
              onClick: () => {
                console.log("Connecting...");
              },
              padding: "not normal",
              width: "max-content",
              text: "Please connect to your wallet",
              styles: {
                display: "flex",
                width: "100%",
                justifyContent: "center",
                fontSize: "16px",
                color: "white",
              },
            }}
          />
        ))}
    </div>

    {state.showDialog ? (
      PoolDiaglog
    ) : (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h4>Your active V3 liquidity positions will appear here</h4>
      </div>
    )}
  </Main>
);
