// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

/** common lib start */
const accountId = props.accountId || context.accountId;
const isSignedIn = !!accountId;
const NEAR_DECIMALS = 24;
const ZSWAP_DECIMALS = 24;
const BIG_ROUND_DOWN = 0;
const MIN_BALANCE_CHANGE = 0.5;

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}
/** common lib end */

// Config for ZSwap app
function getConfig(network) {
  switch (network) {
    case "mainnet":
      return {
        ownerId: "zswapprotocol.near",
        contractId: "zswap-protocol.near",
        nodeUrl: "https://rpc.mainnet.near.org",
        appUrl: "https://app.zswapprotocol.org",
      };
    case "testnet":
      return {
        ownerId: "zswap-builder.testnet",
        contractId: "zswap-protocol.testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        appUrl: "https://testnet.zswapprotocol.org",
      };
    default:
      throw Error(`Unconfigured environment '${network}'.`);
  }
}
const config = getConfig(context.networkId);

State.init({
  tabName: "stake", // stake | unstake
  page: "swap", // "swap" | "pool" | "tokens" | "account"
  nearBalance: "",
  unstakeInfo: {},
});

const Main = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 20px;

  display: flex;
  align-items: center;
  flex-direction: column;
`;

const updateTabName = (tabName) =>
  State.update({
    tabName,
  });

const updatePage = (pageName) => State.update({ page: pageName });

// Account balances
function getNearBalance(accountId, onInvalidate) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      },
    }),
  };
  asyncFetch(config.nodeUrl, options).then((res) => {
    const { amount, storage_usage } = res.body.result;
    const COMMON_MIN_BALANCE = 0.05;

    let newBalance = "-";
    if (amount) {
      const availableBalance = Big(amount || 0).minus(
        Big(storage_usage).mul(Big(10).pow(19))
      );
      const balance = availableBalance
        .div(Big(10).pow(NEAR_DECIMALS))
        .minus(COMMON_MIN_BALANCE);
      newBalance = balance.lt(0) ? "0" : balance.toFixed(5, BIG_ROUND_DOWN);
    }
    State.update({
      nearBalance: newBalance,
    });
    if (onInvalidate) {
      onInvalidate(nearBalance, newBalance);
    }
  });
}

function getZswapBalance(accountId, subscribe) {
  const zswapBalanceRaw = Near.view(
    config.contractId,
    "ft_balance_of",
    {
      account_id: accountId,
    },
    undefined,
    subscribe
  );
  if (!zswapBalanceRaw) return "-";
  const balance = Big(zswapBalanceRaw).div(Big(10).pow(ZSWAP_DECIMALS));
  return balance.lt(0) ? "0" : balance.toFixed();
}

function getAccountDetails(accountId, subscribe) {
  return Near.view(
    config.contractId,
    "get_account_details",
    {
      account_id: accountId,
    },
    undefined,
    subscribe
  );
}

const nearBalance = accountId ? state.nearBalance : "-";
// Initial fetch of account NEAR balance
if (accountId && !isValid(nearBalance)) {
  getNearBalance(accountId);
}
const zswapBalance = accountId ? getZswapBalance(accountId) : "-";
const accountDetails = accountId ? getAccountDetails(accountId) : "-";

function updateAccountInfo({ notUpdateNearBalance, callback }) {
  const interval1 = setInterval(() => {
    const data = getAccountDetails(accountId, true);
    if (
      data.unstaked_balance !== accountDetails.unstaked_balance ||
      data.staked_balance !== accountDetails.staked_balance
    ) {
      // stop polling
      clearInterval(interval1);
      // update NEAR and ZSwap balances
      getZswapBalance(accountId, true);
      if (notUpdateNearBalance) {
        getNearBalance(accountId);
      }
      // invoke callback functions if any
      if (callback) callback();
    }
  }, 500);
  if (!notUpdateNearBalance) {
    const interval2 = setInterval(() => {
      getNearBalance(accountId, (oldBalance, newBalance) => {
        if (
          newBalance !== "-" &&
          oldBalance !== "-" &&
          Big(newBalance).sub(oldBalance).abs().gt(MIN_BALANCE_CHANGE)
        ) {
          // stop polling
          clearInterval(interval2);
        }
      });
    }, 500);
  }
}

function onLoad(data) {
  State.update({ unstakeInfo: data });
}

const SwapView = () => {
  return (
    <Main>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.TitleAndDescription`}
        props={{
          title: "Trade crypto and NFTs with confidence",
          description: "Buy, sell, and explore tokens and NFTs",
        }}
      />
      <Widget src={`${config.ownerId}/widget/ZSwap.Data.Apy`} />
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Page.Swap.Tab`}
        props={{
          tabName: state.tabName,
          updateTabName,
        }}
      />
      {state.tabName === "stake" && (
        <Widget
          src={`${config.ownerId}/widget/ZSwap.Page.Swap.Buy.Buy`}
          props={{ config, nearBalance, zswapBalance, updateAccountInfo }}
        />
      )}
      {state.tabName === "unstake" && (
        <Widget
          src={`${config.ownerId}/widget/ZSwap.Page.Swap.Sell.Sell`}
          props={{
            config,
            zswapBalance,
            unstakeInfo: state.unstakeInfo,
            updateAccountInfo,
            updatePage,
          }}
        />
      )}
    </Main>
  );
};

const PoolView = () => {
  return (
    <Main>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.TitleAndDescription`}
        props={{
          title: "Your active liquidity positions will appear here.",
          description: "",
        }}
      />
      <Widget src={`${config.ownerId}/widget/ZSwap.Data.Apy`} />
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Page.Swap.Tab`}
        props={{
          tabName: state.tabName,
          updateTabName,
        }}
      />
      {state.tabName === "stake" && (
        <Widget
          src={`${config.ownerId}/widget/ZSwap.Page.Swap.Buy.Buy`}
          props={{ config, nearBalance, zswapBalance, updateAccountInfo }}
        />
      )}
      {state.tabName === "unstake" && (
        <Widget
          src={`${config.ownerId}/widget/ZSwap.Page.Swap.Sell.Sell`}
          props={{
            config,
            zswapBalance,
            unstakeInfo: state.unstakeInfo,
            updateAccountInfo,
            updatePage,
          }}
        />
      )}
    </Main>
  );
};
const AccountView = () => {
  return (
    <Widget
      src={`${config.ownerId}/widget/ZSwap.Page.Account.Account`}
      props={{
        config,
        nearBalance,
        zswapBalance,
        unstakeInfo: state.unstakeInfo,
        updatePage,
        updateTabName,
        updateAccountInfo,
      }}
    />
  );
};

const TokenView = () => {
  return (
    <Widget
      src={`${config.ownerId}/widget/ZSwap.Page.Tokens.Tokens`}
      props={{
        config,
        nearBalance,
        zswapBalance,
        unstakeInfo: state.unstakeInfo,
        updatePage,
        updateTabName,
        updateAccountInfo,
      }}
    />
  );
};

const body =
  state.page === "swap" ? (
    <SwapView />
  ) : state.page === "pool" ? (
    <PoolView />
  ) : state.page == "tokens" ? (
    <TokenView />
  ) : (
    <AccountView />
  );

return (
  <Main>
    <Widget
      src={`${config.ownerId}/widget/ZSwap.Data.Unstake`}
      props={{ config, accountDetails, onLoad }}
    />
    <Widget
      src={`${config.ownerId}/widget/ZSwap.Layout.Navigation`}
      props={{
        updatePage,
      }}
    />
    {body}
  </Main>
);
