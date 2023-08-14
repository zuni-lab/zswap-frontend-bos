// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const InputWrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  color: black;
`;

const HorizentalLine = styled.hr`
  height: 1px;
  border: none;
  background: white;
  opacity: 0.1;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const BalanceContainer = styled.div`
  color: #0d9488;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  .error {
    color: #ec6868;
  }
`;

const NEARInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
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
  font-size: 24px;
  color: #0d9488;
  cursor: pointer;
`;

return (
  <InputWrapper>
    <NEARInputContainer>
      <LogoWithText>
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
      <div
        style={{
          display: "flex",
          gap: "16px",
          flex: "1",
        }}
      >
        <input
          style={{
            "text-align": "right",
            background: "transparent",
            border: "1px solid #0d9488",
            "font-size": "16px",
            "font-weight": "bold",
            color: props.inputError ? "#ec6868" : "black",
            "margin-right": "16px",
            outlineColor: "grey",
            "--webkit-appearance": "none",
            "--moz-appearance": "textfield",
            cursor: "auto",
            flex: 1,
            boxShadow: "none",
          }}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
        <div
          style={{
            width: "10%",
          }}
        >
          <MaxTexture onClick={props.onClickMax}>MAX</MaxTexture>
        </div>
      </div>
    </NEARInputContainer>
    <HorizentalLine />
    <BalanceContainer>
      <p>Balance: {props.balance}</p>
      <p className="error">{props.inputError}</p>
    </BalanceContainer>
  </InputWrapper>
);
