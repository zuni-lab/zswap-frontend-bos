// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

/* FOR STYLING */
const App = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  padding: 8px;
`;

const MainLayout = styled.div`
  width: 100%;
  height: calc(100% - 8px);
  border-radius: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OverflowContainer = styled.div`
  width: 100%;
  height: 56vh;
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
  tabName: "SWAP", // SWAP | BUY
  page: "swap", // "swap" | "pool" | "tokens" | "account"
  nearBalance: "",
  unstakeInfo: {},
});

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
    <Container>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.TitleAndDescription`}
        props={{
          title: "Trade crypto and NFTs with confidence",
          description: "Buy, sell, and explore tokens and NFTs",
        }}
      />
      <OverflowContainer>
        <Widget src={`${config.ownerId}/widget/ZSwap.Data.Apy`} />
        <Widget
          src={`${config.ownerId}/widget/ZSwap.Page.Swap.Tab`}
          props={{
            tabName: state.tabName,
            updateTabName,
          }}
        />
        {state.tabName === "SWAP" && (
          <Widget
            src={`${config.ownerId}/widget/ZSwap.Page.Swap.MainSwap`}
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
      </OverflowContainer>
    </Container>
  );
};

const PoolView = () => {
  return (
    <Container>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.TitleAndDescription`}
        props={{
          title: "Pools",
          description: "",
          config: config,
        }}
      />
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Page.Pools.Pools`}
        props={{ config }}
      />
    </Container>
  );
};

const TokenView = () => {
  return (
    <Container>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.TitleAndDescription`}
        props={{
          title: "All tokens here",
          description: "Select a token to view more details",
        }}
      />
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Widget src={`${config.ownerId}/widget/ZSwap.Page.Tokens.Tokens`} />
      </div>
    </Container>
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

const body =
  state.page === "swap" ? (
    <SwapView />
  ) : state.page === "pools" ? (
    <PoolView />
  ) : state.page == "tokens" ? (
    <TokenView />
  ) : (
    <AccountView />
  );

return (
  <App>
    <MainLayout>
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Data.Unstake`}
        props={{ config, accountDetails, onLoad }}
      />
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Layout.Navigation`}
        props={{
          updatePage,
          page: state.page,
        }}
      />
      {body}
    </MainLayout>
  </App>
);
