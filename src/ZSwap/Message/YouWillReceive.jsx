// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const YouWillReceive = styled.div`
  color: gray;
  display: flex;
  justify-content: center;
  font-size: 16px;
  gap: 4px;
`;

return (
  <YouWillReceive>
    <p style={{}}>You will receive: </p>
    <p
      style={{
        color: "#2BCC91",
      }}
    >
      {props.text}
    </p>
  </YouWillReceive>
);
