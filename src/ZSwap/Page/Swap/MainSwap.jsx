// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

/** Constants */
const NEAR_DECIMALS = 24;
const BIG_ROUND_DOWN = 0;

/** State */
State.init({
  token0: "",
  token1: "",
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 60%;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 1px 2px 4px -1px rgba(60, 216, 157, 0.5),
    1px 2px 4px -1px rgba(60, 216, 157, 0.5);
  padding-bottom: 4px;
  color: black;
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
    color: #0d9488;
  }
`;
return (
  <SwapWrapper>
    <Widget
      src={`${config.ownerId}/widget/ZSwap.Element.Input`}
      props={{
        label: "You pay",
        value: state.token0,
        onChange,
        onClickMax,
        inputError: state.inputError,
        balance: nearBalance,
        iconName: "NEAR",
        iconUrl:
          "https://ipfs.near.social/ipfs/bafkreid5xjykpqdvinmj432ldrkbjisrp3m4n25n4xefd32eml674ypqly",
        showBalance: true,
      }}
    />
    <Widget
      src={`${config.ownerId}/widget/ZSwap.Element.Input`}
      props={{
        label: "You receive",
        value: state.token1,
        onChange,
        onClickMax,
        inputError: state.inputError,
        balance: nearBalance,
        iconName: "ETH",
        iconUrl:
          "https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png",
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
  </SwapWrapper>
);
