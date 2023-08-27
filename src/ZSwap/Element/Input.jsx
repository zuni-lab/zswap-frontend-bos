// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Wrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 2px solid #2bcc91;
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
  color: #2bcc91;
  font-size: 16px;
  flex: 1;
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
  color: #2bcc91;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Label = styled.label`
  font-size: ${(props) => props.fontSize || "22px"};
  font-weight: ${(props) => props.fontWeight || "600"};
  color: ${(props) => props.color || "#6b7280"};
  margin-bottom: 8px;
`;

const Container = styled.div`
  display: flex;
  gap: 16px;
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  transition: opacity 0.2s ease-in-out 0s;
  text-align: left;
  color: rgb(13, 17, 28);
  font-weight: 400;
  outline: none;
  border: medium;
  flex: 1 1 auto;
  font-size: 28px;
  white-space: nowrap;
  text-overflow: ellipsis;
  appearance: textfield;
  padding: 16px 16px;
  background: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
`;

return (
  <Wrapper>
    <NEARInputContainer>
      <Label>{props.label}</Label>
      <Container>
        <Input
          placeholder={0}
          value={props.value}
          onChange={props?.onChange}
          textColor={props.inputError && "#ec6868"}
          disabled={!props?.onChange}
        />

        <div
          style={{
            width: "27%",
            minHeight: "100%",
            display: "flex",
          }}
        >
          <Widget
            src={`${props?.config.ownerId}/widget/ZSwap.Element.CustomSelect`}
            props={{
              selectedItem:
                props.selectedToken !== "UNKNOWN" ? props.selectedToken : "",
              list: props.listToken.map((t) => {
                return {
                  value: t.symbol,
                  icon: t.icon,
                };
              }),
              bottom: props.selectPosition.bottom,
              onChangeItem: props.onChangeToken,
            }}
          />
        </div>
      </Container>
    </NEARInputContainer>
    <div
      style={{
        display: "flex",
        justifyContent: "between",
      }}
    >
      <div
        style={{
          color: "#ec6868",
        }}
      >
        {props.inputError}
      </div>
      {props.showBalance && (
        <BalanceContainer>
          <div
            style={{
              color: "black",
            }}
          >
            Balance: <span>{props.balance}</span>
          </div>

          <div>
            <MaxTexture onClick={props.onClickMax}>Max</MaxTexture>
          </div>
        </BalanceContainer>
      )}
    </div>
  </Wrapper>
);
