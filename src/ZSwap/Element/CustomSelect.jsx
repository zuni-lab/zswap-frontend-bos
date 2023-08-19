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

const LogoWithText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Span = styled.span`
  font-size: ${(props) => props.fontSize || "24px"};
  font-weight: ${(props) => props.fontWeight || "bold"};
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
  <>
    {props.selectedItem !== "" ? (
      <CustomSelect
        onClick={() => {
          State.update({
            showList: !state.showList,
          });
        }}
      >
        <LogoWithText>
          {selectedItem.icon}
          <Span>{selectedItem.value}</Span>
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
          {icon}
          <Span>{value}</Span>
        </LogoWithText>
      ))}
    </SelectBody>
  </>
);
