import React from 'react';
import { TableContainer, Table as TableStyled, Td, Th } from './style';
import { FormType } from '../../containers/parkingSpaces/metaData';

// IN REALITY THIS COMPONENT IS RE-USEABLE BUT BECAUSE OF TIME CONSTRAINTS I HAVE NOT CREATED IT AS COMPLETELY REUSE-ABLE COMPONENT
export const Table = ({
  aggregatedChargingValuesData,
  values,
}: {
  aggregatedChargingValuesData: string[][];
  values: FormType;
}) => {
  return (
    <TableContainer>
      <TableStyled>
        <thead>
          <tr>
            <Th style={{ width: '60px' }}></Th> {/* Empty top-left cell */}
            {aggregatedChargingValuesData[0].map((_, index) => (
              <Th key={index}>{index + 1} h</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {aggregatedChargingValuesData.map((powers, i) => (
            <tr>
              <Td>{values.chargingPower[i][0]} kW</Td>
              {powers.map((power, index) => (
                <Td key={index}>{power}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableStyled>
    </TableContainer>
  );
};
