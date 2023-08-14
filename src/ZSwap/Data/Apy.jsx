// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

function getAPY() {
  const result = fetch("https://metrics.zswapprotocol.org", {
    method: "GET",
  });
  const apy = result.body.apy;
  if (!apy) return "-";
  return Big(apy).mul(100).toFixed(2) + "%";
}

const apy = getAPY();

const APYContainer = styled.div`
  font-size: 18px;
  margin: 12px 0;
  text-align: center;
  span {
    margin-left: 12px;
    font-weight: bold;
  }
`;

return (
  <APYContainer>
    APY <span>{apy}</span>
  </APYContainer>
);
