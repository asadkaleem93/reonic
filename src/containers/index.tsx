import React from 'react';
import { ContainerWrapper, AppWrapper } from './style';
import { TopNavBar } from '../components/topNavbar';
import { ParkingSpaces } from './parkingSpaces';

export const App = () => {
  return (
    <AppWrapper>
      <TopNavBar />
      <ContainerWrapper>
        <ParkingSpaces />
      </ContainerWrapper>
    </AppWrapper>
  );
};
