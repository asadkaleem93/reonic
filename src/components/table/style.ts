import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
`;

export const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f4f4f4;
  width: 50px;
`;

export const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 10px;
`;
