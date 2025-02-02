import styled from 'styled-components';

export const SimulationsSectionWrapper = styled.div<{ width?: string }>`
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  width: ${({ width }) => width || 'unset'};
  h3 {
    margin: 0;
    margin: 5px 0px 25px 5px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-self: center;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  background-color: #000;
  opacity: ${({ disabled }) => (disabled ? '.5' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
  color: #fff;
  border-radius: 50px;
  padding: 5px 15px;
  font-weight: 700;
  width: 150px;
`;

export const Label = styled.label<{
  width?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}>`
  font-size: ${({ fontSize }) => fontSize || '16px'};
  font-weight: ${({ fontWeight }) => fontWeight || '500'};
  color: ${({ color }) => color || '#000'};
  width: ${({ width }) => width || 'unset'};
  margin-bottom: 10px;
  display: flex;
  align-self: flex-start;
`;
