// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

const Title = styled.h1`
  font-size: 40px;
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;
const title = props.title ?? "";
const description = props.description ?? "";

return (
  <>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </>
);
