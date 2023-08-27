// MIT License: https://github.com/DV-Lab/zswap-frontend-bos/blob/main/LICENSE

State.init({
  data: {},
});

const Main = styled.div`
  width: 80%;
  align-items: center;
  flex-direction: column;
  position: relative;
  display: flex;
  gap: 8px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 1px 2px 4px -1px rgba(60, 216, 157, 0.5),
    1px 2px 4px -1px rgba(60, 216, 157, 0.5);
  color: black;
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
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
      }
    }
  }
`;

const MOCK_TOKENS = [
  { name: "Token 1", symbol: "TKN1", price: 1.0, change: 0.1 },
  { name: "Token 2", symbol: "TKN2", price: 2.0, change: 0.2 },
  { name: "Token 3", symbol: "TKN3", price: 3.0, change: 0.3 },
  { name: "Token 4", symbol: "TKN4", price: 4.0, change: 0.4 },
  { name: "Token 5", symbol: "TKN5", price: 5.0, change: 0.5 },
];

return (
  <Main>
    <Table>
      <table class="table-fixed">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Pice</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_TOKENS.map((token, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{token.name}</td>
              <td>{token.symbol}</td>
              <td>{token.price}</td>
              <td>{token.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Table>
  </Main>
);
