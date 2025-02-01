import styled from 'styled-components';

export const FormContainer = styled.div`
  width: 50%;
`;

export const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-self: center;
`;

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
`;

export const ChartsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-self: center;
  gap: 10px;
  // @media (max-width: 1400px) {
  //   flex-direction: column;
  //   justify-content: center;
  // }
`;
