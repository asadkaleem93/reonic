import React, { useState } from 'react';
import { Formik } from 'formik';
import { Column, DualAxes } from '@ant-design/plots';

import { ChartsWrapper, ChartWrapper } from './style';
import {
  ChargingEventsType,
  columnChartConfig,
  dualAxisChartConfig,
  FormType,
  ParkingSpacesSchema,
  PeakPowerDemandsType,
  simulateSingleChargePoint,
  transformChartData,
} from './metaData';
import { SimulationsSectionWrapper, Label } from '../../globalStyles/styles';
import { Table } from '../../components/table';
import { Form } from './form';

const chargingStationsAvailable = 20;

export const ParkingSpaces = () => {
  // we can keep these states in use reducer or context as well, but it is a single page solution
  // and after since fiber implementation in react there is bulk re-rendering (asynchronous) rather than
  // synchronous so keeping state like this makes it easy to use/read/understand/update
  const [chargingEventChartData, setChargingEventChartData] = useState<
    ChargingEventsType[]
  >([]);
  const [peakPowerDemandChartData, setPeakPowerDemandChartData] = useState<
    PeakPowerDemandsType[]
  >([]);
  const [aggregatedChargingValuesData, setAggregatedChargingValuesData] =
    useState<string[][]>([]);
  const [totalEnergyChargedPerDay, setTotalEnergyChargedPerDay] =
    useState<number>(0);

  // there is no point converting these into usecallbacks because in watcher array if we use peakpowerdemandchartdata or chargingeventchartdata
  // this constant will keep making new reference, because javascript/react compare array/object values by reference
  // ideal would be if we put check through length, but that is not possible here
  const peakDemandConfig = columnChartConfig(peakPowerDemandChartData);
  const config = dualAxisChartConfig(chargingEventChartData);

  return (
    <>
      <Formik
        initialValues={
          {
            // assumption made that total arrivals are different than cars that are arriving for charging
            // so i kept both and used chargingarrivals as multiplier to other values
            totalArrivals: 200, // default value for total arrivals
            chargingArrivals: 20, // default value for charging arrivals
            carConsumption: 18, // default consumption per car in kWh
            chargingPower: [[11, 20]], // default charging power per chargepoint in kW
            arrivalMultiplier: 100, // default multiplier (100% arrival rate)
          } as FormType
        }
        validationSchema={ParkingSpacesSchema}
        onSubmit={(values) => {
          const {
            chargingArrivals,
            carConsumption,
            chargingPower,
            arrivalMultiplier,
          } = values;

          // BEFORE WE MOVE FORWARD:
          // The current calculations are based on the assumption that the values represent one day's worth of data
          // and all the cars will be completely charged in one day

          // Adjust charging arrivals based on the multiplier (percentage increase)
          const adjustedChargingArrivals = Math.round(
            chargingArrivals + (chargingArrivals * arrivalMultiplier) / 100,
          );

          const completeEnergy = chargingPower.reduce(
            (acc, v) => acc + v[0] * v[1],
            0,
          );

          // Calculate total energy charged (kWh)
          const totalEnergyChargedPerDay =
            adjustedChargingArrivals * carConsumption;

          const { chargingEventsChartData, peakPowerDemanChartData } =
            transformChartData({
              adjustedChargingArrivals,
              chargingStationsAvailable,
              carConsumption,
              completeEnergy,
            });

          const aggregatedChargingValues = chargingPower.map((charger) =>
            simulateSingleChargePoint(
              charger[0] * charger[1],
              adjustedChargingArrivals,
            ),
          );

          // as explaied above this won't make 4 re-renders rather only one re-render because of Fiber implementation
          setTotalEnergyChargedPerDay(totalEnergyChargedPerDay);
          setChargingEventChartData(chargingEventsChartData);
          setPeakPowerDemandChartData(peakPowerDemanChartData);
          setAggregatedChargingValuesData(aggregatedChargingValues);
        }}
      >
        {({ handleSubmit, errors, values, setFieldValue, setFieldError }) => {
          return (
            <>
              <Label fontSize="30px" fontWeight="700">
                Simulations Form
              </Label>
              <Form
                values={values}
                setFieldValue={setFieldValue}
                chargingStationsAvailable={chargingStationsAvailable}
                setFieldError={setFieldError}
                errors={errors}
                handleSubmit={handleSubmit}
                setAggregatedChargingValuesData={
                  setAggregatedChargingValuesData
                }
                chargingArrivals={values.chargingArrivals}
                arrivalMultiplier={values.arrivalMultiplier}
              />
              <>
                {aggregatedChargingValuesData.length ||
                chargingEventChartData.length ? (
                  <Label fontSize="30px" fontWeight="700">
                    Simulations
                  </Label>
                ) : null}
                {totalEnergyChargedPerDay ? (
                  <>
                    <Label fontSize="20px" fontWeight="700">
                      Exemplary Day (kW): {totalEnergyChargedPerDay}
                    </Label>
                  </>
                ) : null}
                <ChartsWrapper>
                  {aggregatedChargingValuesData.length ? (
                    <SimulationsSectionWrapper style={{ display: 'grid' }}>
                      <Label fontSize="20px" fontWeight="700">
                        Charging Event & Charing Consumed (kW)
                      </Label>
                      <Table
                        aggregatedChargingValuesData={
                          aggregatedChargingValuesData
                        }
                        values={values}
                      />
                    </SimulationsSectionWrapper>
                  ) : null}
                  {chargingEventChartData.length ? (
                    <SimulationsSectionWrapper>
                      <ChartWrapper>
                        <Label fontSize="20px" fontWeight="700">
                          Charging Event & Charing Consumed (kW)
                        </Label>
                        <DualAxes {...config} />
                      </ChartWrapper>
                    </SimulationsSectionWrapper>
                  ) : null}
                  {peakPowerDemandChartData.length ? (
                    <SimulationsSectionWrapper>
                      <ChartWrapper>
                        <Label fontSize="20px" fontWeight="700">
                          Peak Demand
                        </Label>
                        <Column {...peakDemandConfig} />
                      </ChartWrapper>
                    </SimulationsSectionWrapper>
                  ) : null}
                </ChartsWrapper>
              </>
            </>
          );
        }}
      </Formik>
    </>
  );
};
