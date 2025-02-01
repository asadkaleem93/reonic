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
