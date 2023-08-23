// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Wrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 1px solid #2BCC91;
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
  color: #2BCC91;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  .error {
    color: #ec6868;
  }
`;

const MaxTexture = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2BCC91;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
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

const { config } = props;

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
          <Widget
            src={`${config.ownerId}/widget/ZSwap.Element.CustomSelect`}
            props={{
              selectedItem:
                props.selectedToken !== "UNKNOWN" ? props.selectedToken : "",
              list: props.listToken.map((t) => ({
                value: t.symbol,
                icon: t.icon,
              })),
              bottom: props.selectPosition.bottom,
              onChangeItem: props.onChangeToken,
            }}
          />
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
