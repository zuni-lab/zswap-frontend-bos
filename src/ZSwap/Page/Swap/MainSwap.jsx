// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

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
});

/** Static variables */
const { config, updateAccountInfo } = props;
if (!config) {
  return "Component cannot be loaded. Missing `config` props";
}

const nearBalance = props.nearBalance || "-";
const zswapBalance = props.zswapBalance || "-";

const accountId = props.accountId || context.accountId;
const isSignedIn = !!accountId;

/** Static helper functions */

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

function formatAmount(a) {
  return isValid(a)
    ? Number(a).toLocaleString(undefined, {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      })
    : a;
}

/** Handle events */
const onChange = (e) => {
  // Has user signed in?
  if (!isSignedIn) {
    State.update({
      inputError: "Sign in please",
    });
    return;
  }
  const targetValue = e.target.value;
  if (targetValue !== "" && !targetValue.match(/^\d*(\.\d*)?$/)) {
    return;
  }
  let stakeAmount = targetValue.replace(/^0+/, "0"); // remove prefix 0
  // limit 24 decimals
  const most24DecimalsPattern = /^-?\d+(\.\d{0,24})?/;
  let values = stakeAmount.match(most24DecimalsPattern);
  if (values) {
    stakeAmount = values[0];
  }
  if (
    nearBalance &&
    (isNaN(Number(stakeAmount)) ||
      stakeAmount === "" ||
      Big(stakeAmount).lt(1) ||
      Big(stakeAmount).gt(Big(nearBalance)))
  ) {
    //TODO: replace logic here
    const token0 = stakeAmount;
    const token1 = (stakeAmount % 10) + 8000;
    if (
      isNaN(Number(stakeAmount)) ||
      stakeAmount === "" ||
      Big(stakeAmount).lt(1)
    ) {
      State.update({
        token0: token0,
        token1: token1,
        inputError: "Stake at least 1 NEAR",
      });
    } else {
      State.update({
        token0: token0,
        token1: token1,
        inputError: `Max is ${nearBalance} NEAR`,
      });
    }
    return;
  }
  //TODO: replace logic here
  const token0 = stakeAmount;
  const token1 = (stakeAmount % 10) + 8000;
  State.update({
    token0: token0,
    token1: token1,
    inputError: "",
  });
};

const onClickMax = () => {
  if (
    isNaN(Number(nearBalance)) ||
    nearBalance === "" ||
    Big(nearBalance).lt(1)
  ) {
    //TODO: replace logic here
    const token0 = nearBalance;
    const token1 = (nearBalance % 10) + 8000;
    State.update({
      token0: token0,
      token1: token1,
      inputError: "Stake at least 1 NEAR",
    });
    return;
  } else {
    //TODO: replace logic here
    const token0 = nearBalance;
    const token1 = (nearBalance % 10) + 8000;
    State.update({
      token0: token0,
      token1: token1,
      inputError: "",
    });
  }
};

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

return (
  <SwapWrapper>
    <Container>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.Input`}
        props={{
          config: config,
          label: "You pay",
          value: state.token0,
          inputError: state.inputError,
          balance: nearBalance,
          selectedToken: state.firstSelectedToken.name,
          listToken: TOKEN_RECORDS,
          showBalance: true,
          onChange: onChange,
          onClickMax: onClickMax,
          onChangeToken: onFirstTokenChange,
        }}
      />
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.Input`}
        props={{
          config: config,
          label: "You receive",
          value: state.token1,
          inputError: state.inputError,
          balance: nearBalance,
          selectedToken: state.secondSelectedToken.name,
          listToken: TOKEN_RECORDS,
          showBalance: false,
          selectPosition: {
            bottom: "calc(100% + 8px)",
          },
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
