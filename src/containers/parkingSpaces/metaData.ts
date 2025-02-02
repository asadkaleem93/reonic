import * as yup from 'yup';

export const ParkingSpacesSchema = yup.object().shape({
  totalArrivals: yup
    .number()
    .min(0, 'Total arrivals must be at least 0')
    .max(500, 'Total arrivals cannot exceed 500')
    .required('Total arrivals field is required'),
  chargingArrivals: yup
    .number()
    .min(0, 'Cars Arriving for charging must be at least 0')
    .max(500, 'Cars Arriving for charging cannot exceed 500')
    .required('Cars Arriving field is required'),
  carConsumption: yup
    .number()
    .min(0, 'Car consumption must be at least 0')
    .max(100, 'Car consumption cannot exceed 100')
    .required('Car consumption field is required'),
  chargingPower: yup
    .number()
    .min(0, 'Charging power must be at least 0')
    .max(50, 'Charging power cannot exceed 50')
    .required('Charging power field is required'),
  arrivalMultiplier: yup
    .number()
    .min(20, 'Arrival Probability Multiplier must be at least 20')
    .max(200, 'Arrival Probability Multiplier cannot exceed 200')
    .required('Arrival Probability field is required'),
});

export const columnChartConfig = (peakPowerDemandChartData) => ({
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
  tooltip: (d) => {
    return {
      name: 'Peak Power Demand',
      value: `${d.peakPowerDemand} kW`,
    };
  },
});

export const dualAxisChartConfig = (chargingEventChartData) => ({
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
      tooltip: (d) => {
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
      tooltip: (d) => {
        return {
          name: 'Energy consumed',
          value: `${d.energyConsumed} kW`,
        };
      },
    },
  ],
});

export const transformChartData = ({
  adjustedChargingArrivals,
  chargingStationsAvailable,
  carConsumption,
  completeEnergy,
}) => {
  // Calculate peak power demand (kW) day/week/month/year
  const peakPowerDemandPerDay =
    adjustedChargingArrivals < chargingStationsAvailable
      ? adjustedChargingArrivals * carConsumption
      : completeEnergy;

  const peakPowerDemandPerWeek = peakPowerDemandPerDay * 7;
  const peakPowerDemandPerMonth = peakPowerDemandPerDay * 30;
  const peakPowerDemandPerYear = peakPowerDemandPerDay * 365;

  // Number of charging events per day/week/month/year
  const chargingEventsPerDay = adjustedChargingArrivals;
  const chargingEventsPerWeek = chargingEventsPerDay * 7;
  const chargingEventsPerMonth = chargingEventsPerDay * 30;
  const chargingEventsPerYear = chargingEventsPerDay * 365;

  // Energy consumed per day/week/month/year
  const energyConsumedPerDay = adjustedChargingArrivals * carConsumption;
  const energyConsumedPerWeek = energyConsumedPerDay * 7;
  const energyConsumedPerMonth = energyConsumedPerDay * 30;
  const energyConsumedPerYear = energyConsumedPerDay * 365;

  const chargingEventsChartData = [] as ChargingEventsType[];
  const peakPowerDemanChartData = [] as PeakPowerDemandsType[];

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

  return { chargingEventsChartData, peakPowerDemanChartData };
};

export const simulateSingleChargePoint = (chargingPower, chargingArrivals) => {
  const hours = 24;
  let powerUsagePerHour = Array(hours).fill(0) as string[];

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

export interface PeakPowerDemandsType {
  interval: 'Day' | 'Week' | 'Month' | 'Year';
  peakPowerDemand: number;
}

export interface ChargingEventsType {
  interval: 'Day' | 'Week' | 'Month' | 'Year';
  chargingEvents: number;
  energyConsumed: number;
}

export interface FormType {
  totalArrivals: number;
  chargingArrivals: number;
  carConsumption: number;
  chargingPower: number[][];
  arrivalMultiplier: number;
}
