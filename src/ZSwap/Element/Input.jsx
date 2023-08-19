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
  flex-direction: column;
  gap: 8px;
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
  top: ${(props) => !props.bottom && "calc(100% + 8px)"};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left || 0};
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
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: ${(props) => props.backgroundColor || "rgba(255, 255, 255, 0.8)"};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: ${(props) => props.fontSize + "px" || "24px"};
  font-weight: bold;
  color: ${(props) => props.textColor || "black"};
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
    border-top: 6px solid ${(props) => props.textColor || "gray"};
  }
`;

const Label = styled.label`
  font-size: ${(props) => props.fontSize || "20px"};
  font-weight: ${(props) => props.fontWeight || "600"};
  color: ${(props) => props.color || "#6b7280"};
`;

const Container = styled.div`
  display: flex;
  gap: 16px;
  position: relative;
  width: ${(props) => props.width || "100%"};
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 16px;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  background: rgba(0, 0, 0, 0.05);
  color: ${(props) => (props.textColor ? "#ec6868" : "black")};
  box-shadow: none;
  border: none;
  outline: none;
  --webkit-appearance: none;
  --moz-appearance: textfield;
`;
const Span = styled.span`
  font-size: ${(props) => props.fontSize || "24px"};
  font-weight: ${(props) => props.fontWeight || "bold"};
  margin-left: ${(props) => props.marginLeft || "10px"};
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
      <Label>{props.label}</Label>
      <Container>
        <Input
          placeholder={0}
          value={props.value}
          onChange={props.onChange}
          textColor={props.inputError && "#ec6868"}
        />
        <Container width="27%">
          {selectedToken ? (
            <CustomSelect
              onClick={() => {
                State.update({
                  showList: !state.showList,
                });
              }}
            >
              <LogoWithText value={selectedToken.symbol}>
                {selectedToken.icon}
                <Span>{selectedToken.symbol}</Span>
              </LogoWithText>
            </CustomSelect>
          ) : (
            <CustomSelect
              backgroundColor="#0d9488"
              fontSize={20}
              textColor="white"
              onClick={() => {
                State.update({
                  showList: !state.showList,
                });
              }}
            >
              Select token
            </CustomSelect>
          )}

          <SelectBody
            style={{
              display: state.showList ? "block" : "none",
            }}
            bottom={props?.selectPosition?.bottom}
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
                <Span>{token.symbol}</Span>
              </LogoWithText>
            ))}
          </SelectBody>
        </Container>
      </Container>
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
