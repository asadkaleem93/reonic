import React, { useState } from 'react';
import { Formik } from 'formik';
import { Column, DualAxes } from '@ant-design/plots';

import { InputField } from '../../components/inputField';
import {
  ChartsWrapper,
  FormContainer,
  SubmitButtonWrapper,
  Table,
  TableContainer,
  Td,
  Th,
} from './style';
import { ParkingSpacesSchema } from './metaData';
import { SubmitButton } from '../../components/inputField/style';
import { SimulationsSectionWrapper } from 'globalStyles/styles';

const chargingStationsAvailable = 20;
const chartIntervals = ['day', 'week', 'month', 'year'];

const simulateSingleChargePoint = (chargingPower, chargingArrivals) => {
  const hours = 24;
  let powerUsagePerHour = Array(hours).fill(0);

  // Distribute cars evenly across 24 hours
  const carsPerHour = Math.round(chargingArrivals / hours);

  for (let hour = 0; hour < hours; hour++) {
    let totalPowerThisHour = 0;

    for (let i = 0; i < carsPerHour; i++) {
      // Each car charges at 50%-100% of max power
      const powerDraw = chargingPower * (0.5 + Math.random() * 0.5);
      totalPowerThisHour += powerDraw;
    }

    // Store the power usage for this hour
    powerUsagePerHour[hour] = totalPowerThisHour.toFixed(2);
  }

  return powerUsagePerHour;
};

export const ParkingSpaces = () => {
  const [chargingEventChartData, setChargingEventChartData] = useState([]);
  const [peakPowerDemandChartData, setPeakPowerDemandChartData] = useState([]);
  const [aggregatedChargingValuesData, setAggregatedChargingValuesData] =
    useState([]);
  console.log('chargingEventChartData', chargingEventChartData);
  console.log('peakPowerDemandChartData', peakPowerDemandChartData);
  const peakDemandConfig = {
    autofit: true,
    responsive: true,
    data: peakPowerDemandChartData,
    xField: 'interval',
    yField: 'peakPowerDemand',
    scale: {
      x: { padding: 0.5 },
    },
    // style: {
    //   maxWidth: 80,
    // },
    tooltip: (d: any) => {
      return {
        name: 'Peak Power Demand',
        value: `${d.peakPowerDemand} kW`,
      };
    },
  };
  const config = {
    data: chargingEventChartData,
    xField: 'interval',
    legend: true,
    autofit: true,
    responsive: true,
    children: [
      {
        type: 'interval',
        yField: 'chargingEvents',
        // style: { maxWidth: 80 },
        axis: {
          y: {
            position: 'left',
            title: 'Charging Events',
            style: { titleFill: '#368AFF' },
          },
        },
        tooltip: (d: any) => {
          return {
            name: 'Charging Events',
            value: d.chargingEvents,
          };
        },
      },
      {
        type: 'line',
        yField: 'energyConsumed',
        style: { lineWidth: 2, stroke: '#1bd1cb' },
        axis: {
          y: {
            position: 'right',
            title: 'Energy Consumed (KW)',
            style: { titleFill: '#1bd1cb', padding: 20 },
          },
        },
        tooltip: (d: any) => {
          return {
            name: 'Energy consumed',
            value: `${d.energyConsumed} kW`,
          };
        },
      },
    ],
  };
  return (
    <>
      <Formik
        initialValues={{
          totalArrivals: 200, // default value for total arrivals
          chargingArrivals: 20, // default value for charging arrivals
          carConsumption: 18, // default consumption per car in kWh
          chargingPower: 11, // default charging power per chargepoint in kW
          arrivalMultiplier: 100, // default multiplier (100% arrival rate)
        }}
        validationSchema={ParkingSpacesSchema}
        onSubmit={(values) => {
          // Extract values from Formik
          const {
            totalArrivals,
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

          // Calculate total energy charged (kWh)
          const totalEnergyChargedPerDay =
            adjustedChargingArrivals * carConsumption;

          // Calculate peak power demand (kW)
          const peakPowerDemandPerDay =
            Math.min(adjustedChargingArrivals, chargingStationsAvailable) *
            chargingPower;
          const peakPowerDemandPerWeek = peakPowerDemandPerDay * 7;
          const peakPowerDemandPerMonth = peakPowerDemandPerDay * 30;
          const peakPowerDemandPerYear = peakPowerDemandPerMonth * 12;

          // Number of charging events per day
          const chargingEventsPerDay = adjustedChargingArrivals;
          const chargingEventsPerWeek = chargingEventsPerDay * 7;
          const chargingEventsPerMonth = chargingEventsPerDay * 30;
          const chargingEventsPerYear = chargingEventsPerMonth * 12;

          // Energy consumed per day/week/month/year
          const energyConsumedPerDay =
            adjustedChargingArrivals * carConsumption;
          const energyConsumedPerWeek = energyConsumedPerDay * 7;
          const energyConsumedPerMonth = energyConsumedPerDay * 30;
          const energyConsumedPerYear = energyConsumedPerDay * 365;

          const chargingEventsChartData = [];
          const peakPowerDemanChartData = [];
          chargingEventsChartData.push({
            interval: 'Day',
            chargingEvents: chargingEventsPerDay,
            energyConsumed: energyConsumedPerDay,
          });
          chargingEventsChartData.push({
            interval: 'Week',
            chargingEvents: chargingEventsPerWeek,
            energyConsumed: energyConsumedPerWeek,
          });
          chargingEventsChartData.push({
            interval: 'Month',
            chargingEvents: chargingEventsPerMonth,
            energyConsumed: energyConsumedPerMonth,
          });
          chargingEventsChartData.push({
            interval: 'Year',
            chargingEvents: chargingEventsPerYear,
            energyConsumed: energyConsumedPerYear,
          });
          peakPowerDemanChartData.push({
            interval: 'Day',
            peakPowerDemand: peakPowerDemandPerDay,
          });
          peakPowerDemanChartData.push({
            interval: 'Week',
            peakPowerDemand: peakPowerDemandPerWeek,
          });
          peakPowerDemanChartData.push({
            interval: 'Month',
            peakPowerDemand: peakPowerDemandPerMonth,
          });
          peakPowerDemanChartData.push({
            interval: 'Year',
            peakPowerDemand: peakPowerDemandPerYear,
          });
          const aggregatedChargingValues = simulateSingleChargePoint(
            chargingPower,
            adjustedChargingArrivals,
          );
          console.log('aggregatedChargingValues ==>', aggregatedChargingValues);
          setChargingEventChartData(chargingEventsChartData);
          setPeakPowerDemandChartData(peakPowerDemanChartData);
          setAggregatedChargingValuesData(aggregatedChargingValues);
        }}
      >
        {({ handleSubmit, errors }) => {
          console.log('errors', errors, Boolean(Object.keys(errors).length));
          return (
            <FormContainer>
              <InputField
                label="Total Cars Arriving:"
                name="totalArrivals"
                min={0}
                max={500}
              />
              <InputField
                label="Cars Arriving for Charging:"
                name="chargingArrivals"
                min={0}
                max={500}
              />
              <InputField
                label="Consumption per Car (kWh):"
                name="carConsumption"
                min={0}
                max={100}
              />
              <InputField
                label="Charging Power per Chargepoint (kW):"
                name="chargingPower"
                min={0}
                max={50}
              />
              <InputField
                label="Arrival Probability Multiplier (%):"
                name="arrivalMultiplier"
                min={20}
                max={200}
              />
              <SubmitButtonWrapper>
                <SubmitButton
                  onClick={() => handleSubmit()}
                  disabled={Boolean(Object.keys(errors).length)}
                >
                  Submit
                </SubmitButton>
              </SubmitButtonWrapper>
            </FormContainer>
          );
        }}
      </Formik>
      <h1 style={{ display: 'flex', alignSelf: 'flex-start' }}>Simulations</h1>
      {aggregatedChargingValuesData.length ? (
        <SimulationsSectionWrapper>
          <h3>Aggregated Charging Values (kW)</h3>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: '60px' }}></Th>{' '}
                  {/* Empty top-left cell */}
                  {aggregatedChargingValuesData.map((_, index) => (
                    <Th key={index}>{index + 1} h</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>11 kW</Td>
                  {aggregatedChargingValuesData.map((row, index) => (
                    <Td key={index}>{row}</Td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </SimulationsSectionWrapper>
      ) : null}
      {chargingEventChartData.length ? (
        <ChartsWrapper>
          <SimulationsSectionWrapper>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <h3>Charging Event & Charing Consumed (kW)</h3>
              <DualAxes {...config} />
            </div>
          </SimulationsSectionWrapper>
          <SimulationsSectionWrapper>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <h3>Peak Demand</h3>
              <Column {...peakDemandConfig} />
            </div>
          </SimulationsSectionWrapper>
        </ChartsWrapper>
      ) : null}
    </>
  );
};
