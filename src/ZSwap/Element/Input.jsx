// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Wrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 1px solid #0d9488;
  background-color: rgba(13, 148, 136, 0.05);
  min-height: 170px;
  cursor: default;
`;

const NEARInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
`;

const BalanceContainer = styled.div`
  color: #0d9488;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  .error {
    color: #ec6868;
  }
`;

const LogoWithText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const MaxTexture = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0d9488;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const SelectBody = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  padding: 8px 16px;
  font-size: 24px;
  font-weight: bold;
  color: black;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`;

const CustomSelect = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 24px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid gray;
  }
`;

State.init({
  showList: false,
});

const selectedToken = props.listToken.find(
  (token) => token.symbol === props.selectedToken
);

const otherTokens = props.listToken.filter(
  (token) => token.symbol !== props.selectedToken
);

return (
  <Wrapper>
    <NEARInputContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: "1",
        }}
      >
        <label
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#6b7280",
          }}
        >
          {props.label}
        </label>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flex: "1",
          }}
        >
          <input
            style={{
              flex: 1,
              padding: "8px 16px",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "left",
              background: "rgba(0, 0, 0, 0.05)",
              color: props.inputError ? "#ec6868" : "black",
              boxShadow: "none",
              border: "none",
              outline: "none",
              "--webkit-appearance": "none",
              "--moz-appearance": "textfield",
            }}
            placeholder={0}
            value={props.value}
            onChange={props.onChange}
          />
          <div
            style={{
              width: "27%",
              position: "relative",
            }}
          >
            <CustomSelect
              onClick={() => {
                State.update({
                  showList: !state.showList,
                });
              }}
            >
              <LogoWithText value={selectedToken.symbol}>
                {selectedToken.icon}
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginLeft: "10px",
                  }}
                >
                  {selectedToken.symbol}
                </span>
              </LogoWithText>
            </CustomSelect>
            <SelectBody
              style={{
                display: state.showList ? "block" : "none",
              }}
            >
              {otherTokens.map((token) => (
                <LogoWithText
                  value={token.symbol}
                  onClick={() => {
                    State.update({
                      showList: false,
                    });
                    props.onChangeToken(token.symbol);
                  }}
                >
                  {token.icon}
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}
                  >
                    {token.symbol}
                  </span>
                </LogoWithText>
              ))}
            </SelectBody>
          </div>
        </div>
      </div>
    </NEARInputContainer>
    {props.showBalance && (
      <BalanceContainer>
        <div
          style={{
            color: "black",
          }}
        >
          Balance: <span>{props.balance}</span>
        </div>
        <div className="error">{props.inputError}</div>
        <div>
          <MaxTexture onClick={props.onClickMax}>Max</MaxTexture>
        </div>
      </BalanceContainer>
    )}
  </Wrapper>
);
