const Container = styled.div`
  display: flex;
  gap: 16px;
  position: relative;
  width: ${(props) => props.width ?? "100%"};
`;

const SelectBody = styled.div`
  position: absolute;
  flex-direction: column;
  gap: 4px;
  top: ${(props) => !props.bottom && "calc(100% + 8px)"};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left || 0};
  width: 100%;
  max-height: 250px;
  overflow: auto;
  padding: 8px 16px;
  font-size: auto;
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
  background: ${props.background ?? "rgba(255, 255, 255, 0.8)"};
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 8px 16px;
  font-size: ${props.fontSize ?? "auto"};
  color: ${props.textColor ?? "black"};
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
    border-top: 6px solid ${props.textColor ?? "gray"};
  }
`;

const LogoWithText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgb(13, 17, 28);
  font-size: 16px;
`;

const Span = styled.span`
  font-size: ${(props) => props.fontSize || "auto"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  margin-left: ${(props) => props.marginLeft || "10px"};
`;

/**
 * @params selectedItem: string  ~ value
 * @params list: Array<{value:string; icon: ReactElement}>
 * @params bottom: string
 * @params onChangeItem: (value: string) => void
 */

State.init({
  showList: false,
});

const selectedItem = props.list.find(
  (item) => item.value === props.selectedItem
);

const otherItems = props.list.filter(
  (item) => item.value !== props.selectedItem
);

return (
  <Container>
    {props.selectedItem !== "" ? (
      <CustomSelect
        onClick={() => {
          State.update({
            showList: !state.showList,
          });
        }}
        style={{
          border: "1px solid rgb(0 0 0 /0.05)",
        }}
      >
        <LogoWithText>
          {selectedItem.icon ? (
            <>
              {typeof selectedItem.icon === "string" ? (
                <img src={selectedItem.icon} width={24} height={24} />
              ) : (
                selectedItem.icon
              )}
              <Span>{selectedItem.value}</Span>
            </>
          ) : (
            <Span>Select token</Span>
          )}
        </LogoWithText>
      </CustomSelect>
    ) : (
      <CustomSelect
        backgroundColor="rgba(43 202 144)"
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
        display: state.showList ? "flex" : "none",
      }}
      bottom={props?.bottom}
    >
      {otherItems.map(({ value, icon }) => (
        <LogoWithText
          onClick={() => {
            State.update({
              showList: false,
            });
            props.onChangeItem(value);
          }}
        >
          <>
            {typeof icon === "string" ? (
              <img src={icon} width={24} height={24} />
            ) : (
              icon
            )}
            <Span>{value}</Span>
          </>
        </LogoWithText>
      ))}
    </SelectBody>
  </Container>
);
