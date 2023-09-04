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
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border: 2px solid #ddd;
`;

const Table = styled.div`
  width: 100%;
  padding: 20px;
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 18px;
    thead {
      tr {
        th {
          padding: 24px 16px;
          text-align: left;
          border-bottom: 2px solid #2bcc91;
          background-color: rgba(13, 148, 136, 0.05);
          border-radius: 10px 10px 0 0;
        }
      }
    }
  }
`;

const Tr = styled.tr`
  overflow: hidden;
  td {
    padding: 24px 16px;
    text-align: left;
    background-color: ${(props) => props.cellColor || "white"};
  }
`;

/** State */
State.init({
  NFTs: [],
});
/** side effect function */

function fetchListOfNFT() {
  return Near.asyncView("manager.zswap.testnet", "nft_tokens_for_owner", {
    account_id: "traderz.testnet",
    fee: 3000,
  }).then((res) => {
    return res.map((item) => {
      return {
        title: item.metadata.title,
        description: item.metadata.description,
        image: item.metadata.media,
      };
    });
  });
}

const $fetchListOfNFT = () => {
  fetchListOfNFT().then((res) => {
    const array = Array(10).fill(res[0]);
    State.update({ NFTs: array });
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
          className={index}
          style={{
            width: "33.33333%",
            padding: "10px",
            borderRadius: "50px",
            overflow: "hidden",
          }}
        >
          <img
            src={token.image}
            alt={`NFT of ${token.title}`}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      ))}
    </Container>
  </Wrapper>
);
