// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Wrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 1px solid #0d9488;
  background-color: rgba(13, 148, 136, 0.05);
  min-height: 170px;
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

const NEARTexture = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
`;

const LogoWithText = styled.div`
  display: flex;
  align-items: center;
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
              cursor: "auto",
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
          <LogoWithText
            style={{
              width: "20%",
            }}
          >
            <img
              src={
                props.iconUrl ||
                `https://ipfs.near.social/ipfs/bafkreid5xjykpqdvinmj432ldrkbjisrp3m4n25n4xefd32eml674ypqly`
              }
              width={26}
              height={26}
              alt="Token Icon"
            />
            <NEARTexture>{props.iconName}</NEARTexture>
          </LogoWithText>
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
