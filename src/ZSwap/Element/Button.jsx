// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const type = props.type || "primary"; // primary || outline
const size = props.size || "lg"; // lg || base
const full = props.full || "full"; // full || none
const padding = props.padding || "normal"; // normal || large

const PrimaryButton = styled.button`
  width: ${(props) => props.width || "100%"};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0d9488;
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

const OutlineButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #30348a;
  color: #30348a;
  ${full === "full" && "width: 100%;"}
  border-radius: 10px;
  font-size: ${size === "lg" ? "20px" : "16px"};
  font-weight: bold;
  overflow: hidden;
  padding: ${padding === "normal" ? "8px 0" : "12px 24px"};
  transition: all 0.3s ease-in-out;

  &:disabled {
    background: #1c2056;
    color: #3d47d6;
  }
  &:hover {
    border: 2px solid #404be2;
    color: white;
    background: #404be2;
  }
`;
if (type === "outline") {
  return (
    <OutlineButton disabled={props.disabled} onClick={props.onClick}>
      {props.text}
    </OutlineButton>
  );
} else {
  return (
    <div style={props.styles}>
      <PrimaryButton
        disabled={props.disabled}
        onClick={props.onClick}
        width={props.width}
      >
        {props.text}
        <span>{props.icon}</span>
      </PrimaryButton>
    </div>
  );
}
