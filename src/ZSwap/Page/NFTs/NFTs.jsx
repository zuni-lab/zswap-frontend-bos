// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  //wrapper-height
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  //shadow-xl
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  color: black;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 50px;
  overflow: hidden;
<<<<<<< HEAD
  background-color: rgba(0, 0, 0, 0.01);
=======
  background-color: rgba(0, 0, 0, 0.05);
>>>>>>> main
  border-radius: 10px;
  border: 2px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  height: 50px;
  width: ${(props) => props.width || "100%"};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
<<<<<<< HEAD
  background-color: ${props.background ?? "#333"};
=======
  background-color: ${props.background ?? "#2BCC91"};
>>>>>>> main
  color: white;
  border-radius: 10px;
  font-weight: bold;
  overflow: hidden;
  padding: ${padding === "normal" ? "8px 0" : "12px 24px"};
  cursor: pointer;
  border: none;
  z-index: 0;
  &:disabled {
    background: #9ca3af;
    color: white;
  }

  &:hover {
    opacity: ${props.disabled ? "1" : "0.8"};
  }
  &:hover:before {
    opacity: ${props.disabled ? "0" : "1"};
  }
`;

/**Global variable */

const ACCOUNT_ID = context.accountId;
const SMART_CONTRACT_ID = "manager3.zswap.testnet";

/** State */
State.init({
  NFTs: [],
});
/** side effect function */

function fetchListOfNFT() {
  return Near.asyncView(SMART_CONTRACT_ID, "nft_tokens_for_owner", {
    account_id: ACCOUNT_ID,
  }).then((res) => {
    return res.map((item) => {
      return {
        id: item.token_id,
        title: item.metadata.title,
        description: item.metadata.description,
        image: item.metadata.media,
      };
    });
  });
}

function burnNFT(tokenId) {
  return Near.call(
    SMART_CONTRACT_ID,
    "burn",
    {
      nft_id: tokenId,
    },
    300000000000000
  ).then((res) => {
    console.log({ res });
    return res;
  });
}

const $fetchListOfNFT = () => {
  fetchListOfNFT().then((res) => {
    State.update({ NFTs: res });
  });
};

/**
 *
 * @param {*} tokenIndex = "firstSelectedToken" or "secondSelectedToken
 */

/** Static variables */

/** Handle events  */

/** Call function */

$fetchListOfNFT();

return (
  <Wrapper>
    <Container>
      {state.NFTs?.map((token, index) => (
        <div
          style={{
            padding: "20px 10px",
            width: "25%",
          }}
        >
          <Card key={index}>
            <img
              src={token.image}
              alt={`NFT of ${token.title}`}
              style={{
                width: "100%",
                height: "100%",
              }}
              objectFit="cover"
            />
            <Button onClick={() => burnNFT(token.id)}>Burn</Button>
          </Card>
        </div>
      ))}
    </Container>
  </Wrapper>
);
