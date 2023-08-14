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

const tabName = props.tabName || "stake";
return (
  <TabContainer>
    <TabItem
      active={tabName === "stake"}
      onClick={() => props.updateTabName("stake")}
    >
      Stake
    </TabItem>
    <TabItem
      active={tabName === "unstake"}
      onClick={() => props.updateTabName("unstake")}
    >
      Unstake
    </TabItem>
  </TabContainer>
);
