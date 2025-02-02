import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Input = styled.input<{ isError?: boolean }>`
  padding: 8px;
  border: 1px solid ${({ isError }) => (isError ? '#e74c3c' : '#ccc')};
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ isError }) => (isError ? '#e74c3c' : '#000')};
    box-shadow: 0 0 5px ${({ isError }) => (isError ? '#e74c3c' : '#000')};
  }
`;

export const ErrorMessage = styled.p`
  font-size: 14px;
  color: #e74c3c;
  margin: 0;
`;
