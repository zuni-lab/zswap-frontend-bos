/** Constants */
const NEAR_DECIMALS = 24;
const BIG_ROUND_DOWN = 0;
const TOKENS = ["ZSWAP", "NEAR", "ETH", "UNKNOWN"];
const TOKEN_RECORDS = [
  {
    name: "ZSWAP",
    symbol: "ZSWAP",
    icon: (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: "26px",
          height: "26px",
          padding: "4.5px",
          backgroundColor: "#e4e8e9",
        }}
      >
        <svg
          width={36}
          height={(36 * 83) / 80}
          viewBox="0 0 80 83"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M78.9694 37.4636C78.9335 37.5673 78.8943 37.671 78.8552 37.7778L78.4375 37.6395L50.6776 28.4349L28.4905 21.0844L12.9041 15.918C11.7958 15.5306 10.8287 14.8408 10.1207 13.9328C9.41268 13.0249 8.99439 11.9381 8.9169 10.805C8.9169 10.6762 8.9169 10.5473 8.9169 10.4153C8.9169 10.2833 8.9169 10.1828 8.9169 10.0665C8.95012 9.50294 9.06884 8.9471 9.26928 8.41666C10.4742 5.22976 12.944 2.63429 16.1356 1.20105C19.3271 -0.23219 22.979 -0.385834 26.2881 0.773893L29.4726 1.8235L67.1613 14.243C70.7504 15.4278 73.6379 17.637 75.9317 20.2139C77.4032 21.8763 78.8682 25.3269 78.8682 25.3269L79.0999 25.9868C80.3435 29.7257 80.2977 33.7518 78.9694 37.4636Z"
            fill="black"
          />
          <path
            opacity="0.5"
            d="M71.1156 71.9856C71.1155 72.2051 71.1024 72.4244 71.0764 72.6424C71.0229 73.1005 70.9134 73.5509 70.7501 73.9843C70.1539 75.5625 69.2406 77.0122 68.0626 78.2505C66.8846 79.4887 65.4648 80.4913 63.8844 81.2011C62.3041 81.9108 60.594 82.3137 58.8519 82.3868C57.1098 82.4599 55.3698 82.2017 53.7314 81.627L50.5208 80.5711L12.8647 68.1705C9.30191 67.0045 6.18273 64.8386 3.90829 61.9513C1.20063 58.5203 -0.16386 54.2794 0.0549187 49.975C0.14756 48.1505 0.523705 46.3496 1.1708 44.6326V44.6074H1.20669L28.81 53.7555L51.666 61.3323L67.1186 66.4547C68.1796 66.8263 69.1121 67.4754 69.8112 68.3292C70.5103 69.183 70.9485 70.2076 71.0764 71.288C71.1036 71.5196 71.1167 71.7525 71.1156 71.9856Z"
            fill="black"
          />
          <path
            opacity="0.5"
            d="M78.9463 37.4332L78.4145 37.606L28.7872 53.7526L3.88548 61.9233C1.17359 58.4928 -0.194448 54.2505 0.0223133 49.9438C0.114954 48.1193 0.4911 46.3185 1.1382 44.6014H1.18387L50.6513 28.3983L75.9054 20.1804C75.9054 20.1804 78.0001 23.0779 78.8419 25.2934C78.9039 25.4568 79.0736 25.9533 79.0736 25.9533C80.319 29.6929 80.2743 33.7201 78.9463 37.4332Z"
            fill="black"
          />
          <path
            opacity="0.5"
            d="M29.4791 1.82059V15.5443C29.4825 17.4302 29.1514 19.3029 28.5003 21.0815C27.3073 24.3216 25.1014 27.1262 22.1858 29.1093C19.2702 31.0925 15.7882 32.1568 12.2189 32.156H11.4391C10.7716 32.1551 10.1317 31.8992 9.66004 31.4443C9.18836 30.9894 8.92343 30.3728 8.92343 29.7299V10.0636C8.95665 9.50003 9.07538 8.94418 9.27582 8.41374C10.4808 5.22685 12.9506 2.63137 16.1421 1.19813C19.3336 -0.235108 22.9855 -0.388753 26.2946 0.770975L29.4791 1.82059Z"
            fill="black"
          />
          <path
            opacity="0.5"
            d="M71.0765 53.1211V72.6428C71.0229 73.1009 70.9134 73.5513 70.7502 73.9846C70.1539 75.5629 69.2407 77.0126 68.0627 78.2508C66.8846 79.4891 65.4649 80.4917 63.8845 81.2014C62.3041 81.9111 60.594 82.3141 58.8519 82.3872C57.1098 82.4603 55.3699 82.2021 53.7314 81.6274L50.5208 80.5715V67.3224C50.5165 65.2811 50.9048 63.2566 51.666 61.3515C52.9193 58.215 55.1301 55.5179 58.007 53.6161C60.8839 51.7142 64.2917 50.6969 67.781 50.6981H68.5739C69.2388 50.7014 69.8753 50.9582 70.3443 51.4122C70.8132 51.8662 71.0765 52.4806 71.0765 53.1211Z"
            fill="black"
          />
        </svg>
      </span>
    ),
  },
  {
    name: "NEAR",
    symbol: "NEAR",
    icon: (
      <img
        src={
          "https://seeklogo.com/images/N/near-icon-logo-10785AE366-seeklogo.com.png"
        }
        width={26}
        height={26}
        alt="NEAR ICON"
      />
    ),
  },
  {
    name: "ETHEREUM",
    symbol: "ETH",
    icon: (
      <img
        src={"https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png"}
        width={26}
        height={26}
        alt="NEAR ICON"
      />
    ),
  },
];

/** State */
State.init({
  firstSelectedToken: {
    name: TOKENS[0],
    amount: "",
  },
  secondSelectedToken: {
    name: TOKENS.pop(),
    amount: "",
  },
  inputError: "",
  show_fee_choices: false,
  fee_chosen: 0
});

/** Static variables */
const { config } = props;
if (!config) {
  return "Component cannot be loaded. Missing `config` props";
}

const Main = styled.div`
  width: 80%;
  min-height: 50vh;
  flex-direction: column;
  align-items: center;
  display: flex;
  gap: 20px;
  padding: 32px 20px;
  border-radius: 10px;
  box-shadow: 1px 2px 6px -2px rgba(60, 216, 157, 0.5),
    1px 2px 6px -2px rgba(60, 216, 157, 0.5);
  color: black;
`;

const DialogWrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 1px solid #2BCC91;
  background-color: white;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
`;
const DialogBody = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
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
  background: #2BCC91;
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
  width: 100%;
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

const onFirstTokenChange = (token) => {
  State.update({
    firstSelectedToken: { ...firstSelectedToken, name: token },
  });
};

const onSecondTokenChange = (token) => {
  State.update({
    secondSelectedToken: { ...secondSelectedToken, name: token },
  });
};
/////////////////////////////////////////////////////////////////////////////////
// const contract = "hello.near-examples.near";
// const contract = "hello"
// const greeting = Near.view(contract, "get_greeting", {});

// // Use and manipulate state
// State.init({ greeting });

// const onInputChange = ({ target }) => {
//   State.update({ greeting: target.value });
// };

// const onBtnClick = () => {
//   Near.call(contract, "set_greeting", {
//     greeting: state.greeting,
//   });
// };

/////////////////////////////////////////////////////////////////////////////////
const ChooseFeeWrapper = styled.div`
.fee_choices_container{
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
border: 1px solid rgb(210, 217, 238);
}

.fee_choice_chosen{
border: 1px solid rgb(43, 204, 145);
}
.fee_choice:hover{
border: 1px solid rgb(43, 204, 145);
}

.fee_choice .top{
display: flex;
justify-content: space-between;
font-size: 14px
}

.fee_choice .top .tick_circle{
background: rgb(43, 204, 145);
width: 17px;
height: 17px;
display: flex;
justify-content: center;
align-items: center;
border-radius: 50%;
}

.fee_choice .mid{
font-size: 12px;
color: rgb(119, 128, 160);
}

.fee_choice .bottom{
background: rgb(232, 236, 251);
border: unset;
border-radius: 0.5rem;
color: rgb(0, 0, 0);
padding: 4px 6px;
font-weight: 500;
font-size: 10px;
width: max-content;
}

.fee_input_container{
  display: flex;
  justify-content: space-between;
  border: 1px solid rgb(232, 236, 251);
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 12px;
  margin-top: 12px;
}
.fee_input_container .fee_info{
  display: flex;
  flex-direction: column;
}
.fee_input_container .fee_info .fee_tier{
  color: rgb(13, 17, 28);
  font-weight: 600;
}

.fee_input_container .fee_info .percent_select{
  background: rgb(232, 236, 251);
  border: unset;
  border-radius: 0.5rem;
  color: rgb(0, 0, 0);
  padding: 4px 6px;
  font-weight: 500;
  font-size: 10px;
  width: max-content;
}

.fee_input_container .toggle_fee_choices{
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

const fee_descriptions = [
  [0.01, "very stable pairs", 32],
  [0.05, "stable pairs", 0],
  [0.3, "most pairs", 0],
  [0.1, "exotic pairs", 0],
];
// Define components

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
.amount_input_container{
  max-width: 500px;
  border-radius: 20px;
  border: 1px solid rgb(255, 255, 255);
  background-color: rgb(245, 246, 252);
  padding: 1rem 1rem 0.75rem;
}

.top_row{
  display: flex;
  justify-content: space-between;
}
.bottom_row{
  display: flex;
  justify-content: space-between;
}
.amount_input_container:hover{
  border: 1px solid rgb(184, 192, 220);
}

.amount_input{
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

.usd_valuation{
  box-sizing: border-box;
  font-weight: 400;
  font-size: 14px;
  color: rgb(119, 128, 160);
}

.top_row .token_name{
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(232, 236, 251);
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

.top_row .token_name img{
  height: 24px;
  width: 24px;
  border-radius: 50%;
}
.bottom_row .balance_container{
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.bottom_row .balance_container .balance{
  font-weight: 500;
  font-size: 14px;
}
.bottom_row .balance_container .max_balance_btn: hover {
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
`;
const ChooseDepositAmount = (
  <ChooseDepositAmountWrapper>
    <Label fontSize={18} justifyContent={"flex-start"}>
      Deposit Amounts
    </Label>
    <div class="amount_input_container">
      <div class="top_row">
        <input class="amount_input" type="number" />
        <div class="token_name">
          <img
            src="data:image/png;base64,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"
            alt="ETH logo"
            class="sc-12k1pn4-1 bwVixy"
          />
          ETH
        </div>
      </div>
      <div class="bottom_row">
        <div class="usd_valuation">$5.32M</div>
        <div class="balance_container">
          <div class="balance">Balance: 0</div>
          <div class="max_balance_btn">MAX</div>
        </div>
      </div>
    </div>

    <div class="amount_input_container">
      <div class="top_row">
        <input class="amount_input" type="number" />
        <div class="token_name">
          <img
            src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
            alt="USDT logo"
            class="sc-12k1pn4-1 bwVixy"
          />
          USDT
        </div>
      </div>
      <div class="bottom_row">
        <div class="usd_valuation">$5.32M</div>
        <div class="balance_container">
          <div class="balance">Balance: 0</div>
          <div class="max_balance_btn">MAX</div>
        </div>
      </div>
    </div>
  </ChooseDepositAmountWrapper>
);

/////////////////////////////////////////////////////////////////////////////////

const ChoosePriceRangeWrapper = styled.div`
.price_choices_container{
  display: flex;
  justify-content: space-between;
  max-width: 500px;
}
.price_choices_container .price_choice {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  width: 48%;
  border-radius: 12px;
  border: 1px solid rgb(210, 217, 238);
}

.price_choice .price_label{
    font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: rgb(119, 128, 160);
}

.price_choice .price_notation_label{
  min-width: 0px;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: rgb(119, 128, 160);
}

.price_input_container{
  display: flex;
}

.price_input{
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
  text-align: center;
  font-size: 20px;
}
.price_adjust_btn{
  color: rgb(13, 17, 28) !important;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.price_adjust_btn:hover{
  background: rgb(210, 218, 247);
  border-radius: 8px;
}

.full_range_btn{
  padding: 8px;
  width: 100%;
  text-align: center;
  border-radius: 8px;
  color: rgb(13, 17, 28);
  cursor: pointer;
  border: 1px solid rgb(210, 217, 238);
  font-weight: 400;
  font-size: 12px;
  margin-top: 12px;
}

.full_range_btn: hover{
  background: #f0f2f2;
}

`;
const ChoosePriceRangeForm = (
  <ChoosePriceRangeWrapper>
    <div class="price_choices_container">
      <div class="price_choice">
        <div class="price_label">Min Price</div>
        <div class="price_input_container">
          <div class="price_adjust_btn minus">-</div>
          <input
            class="price_input"
            inputmode="decimal"
            autocomplete="off"
            autocorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            value="0.00000099462"
          />
          <div class="price_adjust_btn plus">+</div>
        </div>
        <div class="price_notation_label">USDT per ETH</div>
      </div>
      <div class="price_choice">
        <div class="price_label">Max Price</div>
        <div class="price_input_container">
          <div class="price_adjust_btn minus">-</div>
          <input
            class="price_input"
            inputmode="decimal"
            autocomplete="off"
            autocorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            value="5146"
          />
          <div class="price_adjust_btn plus">+</div>
        </div>
        <div class="price_notation_label">USDT per ETH</div>
      </div>
    </div>
    <div class="full_range_btn">Full range</div>
  </ChoosePriceRangeWrapper>
);

/////////////////////////////////////////////////////////////////////////////////

const childSrc = context.networkId;
const accountId = context.accountId;

const NewPositionButton = (
  <Widget src={`${config.ownerId}/widget/ZSwap.Element.Button`}
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
                selectedItem:
                  state.firstSelectedToken.name !== "UNKNOWN"
                    ? state.firstSelectedToken.name
                    : "",
                list: TOKEN_RECORDS.map((t) => ({
                  value: t.symbol,
                  icon: t.icon,
                })),
                onChangeItem: onFirstTokenChange,
              }}
              style={{
                flex: 1,
              }}
            />
            <Widget
              src={`${config.ownerId}/widget/ZSwap.Element.CustomSelect`}
              props={{
                selectedItem:
                  state.secondSelectedToken.name !== "UNKNOWN"
                    ? state.secondSelectedToken.name
                    : "",
                list: TOKEN_RECORDS.map((t) => ({
                  value: t.symbol,
                  icon: t.icon,
                })),
                onChangeItem: onSecondTokenChange,
              }}
              style={{
                flex: 1,
              }}
            />
          </div>
          { ChooseFeeForm }
          { ChooseDepositAmount }
        </Section>
        <Section>
          <div
            style={{
            }}
          >
            {ChoosePriceRangeForm}
          </div>
        </Section>
      </DialogBody>
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
      {connectWallet() && (
        accountId ? (!state.showDialog && NewPositionButton) : <Widget
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
            color: "white"
          },
        }}
        />
      )}
    </div>

    {state.showDialog ? PoolDiaglog :
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
    }
  </Main>
);
