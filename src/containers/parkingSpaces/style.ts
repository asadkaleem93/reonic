import styled from 'styled-components';

export const FormContainer = styled.div`
  width: 50%;
`;

export const ChartsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CharginPowerFieldsWrapper = styled.div`
  padding: 10px;
  border: 1px solid lightGrey;
  border-radius: 10px;
  margin: 10px 0px;
`;

export const CharginPowerFieldWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  .remove-button {
    cursor: pointer;
  }
  input {
    width: 200px;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    justify-self: flex-start;
    width: 100%;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
    label {
      width: unset;
    }
    input {
      width: 90%;
    }
  }
`;
