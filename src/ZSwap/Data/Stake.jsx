// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const accountId = props.accountId || context.accountId;
const ZSWAP_DECIMALS = 24;
const subgraphApiUrl =
  context.networkId === "mainnet"
    ? "https://api.thegraph.com/subgraphs/name/zswap-protocol/zswap"
    : "https://api.thegraph.com/subgraphs/name/zswap-protocol/zswap-testnet";

const { config, onLoad } = props;
if (!config) {
  return "Component cannot be loaded. Missing `config` props";
}

function getZswapPrice() {
  return Big(Near.view(config.contractId, "ft_price", "{}") ?? "0").div(
    Big(10).pow(ZSWAP_DECIMALS)
  );
}

function querySubgraph(query, variables) {
  const res = fetch(subgraphApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  if (res && res.ok) {
    return res.body;
  } else {
    return {};
  }
}

function queryStakingData(accountId, excludingFees) {
  const { data } = querySubgraph(`
    {
      users (first: 1, where: {id: "${accountId}"} ){
        firstStakingTime
        mintedZswap
        stakedNear
        unstakedZswap
        unstakeReceivedNear
        feesPaid
        transferedInShares
        transferedInValue
        transferedOutShares
        transferedOutValue
      }
    }
  `);
  if (!data) {
    return undefined;
  }
  const user = data.users[0];
  if (!user) {
    return undefined;
  }

  const zswapPrice = getZswapPrice();
  if (Number(zswapPrice) === 0) {
    return undefined;
  }

  const {
    firstStakingTime,
    stakedNear,
    mintedZswap,
    unstakedZswap,
    unstakeReceivedNear,
    feesPaid,
    transferedInShares,
    transferedInValue,
    transferedOutShares,
    transferedOutValue,
  } = user;

  const transferIn = zswapPrice
    .mul(transferedInShares)
    .minus(transferedInValue);
  const transferOut = zswapPrice
    .mul(transferedOutShares)
    .minus(transferedOutValue);
  const netTransfer = transferIn.minus(transferOut);

  const currentZswap = Big(mintedZswap).minus(unstakedZswap);
  const rewards = currentZswap
    .mul(zswapPrice)
    .minus(stakedNear)
    .plus(unstakeReceivedNear)
    .plus(netTransfer);

  return {
    // turn nanoseconds into milliseconds
    firstStakingTime: firstStakingTime
      ? parseInt(firstStakingTime / 1_000_000)
      : undefined,
    // add fees if necessary
    stakingRewards: (excludingFees ? rewards : rewards.plus(feesPaid)).toFixed(
      0
    ),
  };
}

if (onLoad) {
  const data = queryStakingData(accountId);
  if (data) {
    onLoad(data);
  }
}

return <div style={{ display: "none" }} />;
