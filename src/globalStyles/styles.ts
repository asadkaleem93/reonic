import styled from 'styled-components';

export const SimulationsSectionWrapper = styled.div<{ width?: string }>`
  // display: grid;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  width: 100%;
  // width: ${({ width }) => width || 'unset'};
  // @media (max-width: 1400px) {
  //   width: 100% !important;
  // }
  h3 {
    margin: 0;
    margin: 5px 0px 25px 5px;
  }
`;
