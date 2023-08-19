/** Static variables */
State.init({
  showDialog: false,
});

const { config } = props;
if (!config) {
  return "Component cannot be loaded. Missing `config` props";
}

const Main = styled.div`
  width: 80%;
  min-height: 50vh;
  flex-direction: column;
  align-items: center;
  display: flex;
  gap: 20px;
  padding: 32px 20px;
  border-radius: 10px;
  box-shadow: 1px 2px 6px -2px rgba(60, 216, 157, 0.5),
    1px 2px 6px -2px rgba(60, 216, 157, 0.5);
  color: black;
`;

const DialogWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  padding: 20px;
  color: black;
  border: 1px solid #0d9488;
  background-color: #f0fdfa;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
`;
const DialogBody = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  & > div {
    flex: 1;
    padding: 8px;
  }
`;

const Section = styled.div`
  flex: 1;
`;

const Horizontal = styled.hr`
  width: 100%;
  background: #0d9488;
  border: 0;
  height: 1px;
  border-radius: 9999px;
`;

const ArrowWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #0d9488
  &:hover {
    opacity: 0.9;
    color: #000;
  }
`;

const connectWallet =
  props.connectWallet ||
  (() => {
    return true;
  });

return (
  <Main>
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      {connectWallet() && (
        <Widget
          src={`${config.ownerId}/widget/ZSwap.Element.Button`}
          props={{
            onClick: () => {
              console.log("Connecting...");
            },
            text: "Connect wallet",
            width: "180px",
            styles: {
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              fontSize: "16px",
              color: "white",
            },
          }}
        />
      )}
      <Widget
        src={`${config.ownerId}/widget/ZSwap.Element.Button`}
        props={{
          onClick: () => {
            State.update({ showDialog: true });
          },
          text: (
            <span
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="white"
                width={16}
                height={16}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>{" "}
              <span>New position</span>
            </span>
          ),
          width: "180px",
          styles: {
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            fontSize: "16px",
            color: "white",
          },
        }}
      />
    </div>

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h4>Your active V3 liquidity positions will appear here</h4>
    </div>

    {state.showDialog && (
      <DialogWrapper>
        <DialogHeader>
          <ArrowWrapper
            onClick={() => {
              State.update({ showDialog: false });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={28}
              height={28}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          </ArrowWrapper>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Add liquidity
          </div>
        </DialogHeader>
        <Horizontal />
        <DialogBody>
          <Section>
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            ></div>
          </Section>
          <Section>
            <div
              style={{
                backgroundColor: "#0d9488",
              }}
            >
              Section 2
            </div>
          </Section>
        </DialogBody>
      </DialogWrapper>
    )}
  </Main>
);
