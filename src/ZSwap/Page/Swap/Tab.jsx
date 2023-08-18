// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  border-radius: 9999px;
  padding: 4px;
`;

const TabItem = styled.div`
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-o;
  background-color: ${(props) => (props.active ? "#0d9488" : "transparent")};
  border-color: ${(props) => (props.active ? "transparent" : "#0d9488")};
  color: ${(props) => (props.active ? "white" : "#0d9488")};
  border-style: solid;
  border-width: 2px;
`;

const TAB_RECORD = {
  SWAP: "SWAP",
  BUY: "BUY",
};
const tabName = props.tabName || TAB_RECORD.SWAP;

return (
  <TabContainer>
    <TabItem
      active={tabName === TAB_RECORD.SWAP}
      onClick={() => props.updateTabName(TAB_RECORD.SWAP)}
    >
      {TAB_RECORD.SWAP}
    </TabItem>
    <TabItem
      active={tabName === TAB_RECORD.BUY}
      onClick={() => props.updateTabName(TAB_RECORD.BUY)}
    >
      {TAB_RECORD.BUY}
    </TabItem>
  </TabContainer>
);
