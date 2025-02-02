import { simulateSingleChargePoint } from './metaData';

describe('simulateSingleChargePoint', () => {
  test('returns an array of 24 elements', () => {
    const chargingPower = 11;
    const chargingArrivals = 50;
    const result = simulateSingleChargePoint(chargingPower, chargingArrivals);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(24);
  });

  test('handles zero arrivals correctly', () => {
    const chargingPower = 11;
    const chargingArrivals = 0;
    const result = simulateSingleChargePoint(chargingPower, chargingArrivals);

    expect(result).toEqual(Array(24).fill('0.00'));
  });

  test('ensures power usage per hour is within expected limits', () => {
    const chargingPower = 11;
    const chargingArrivals = 50;
    const carsPerHour = Math.round(chargingArrivals / 24);

    const minPerCar = chargingPower * 0.5;
    const maxPerCar = chargingPower * 1.0;
    const minTotal = (minPerCar * carsPerHour).toFixed(2);
    const maxTotal = (maxPerCar * carsPerHour).toFixed(2);

    const result = simulateSingleChargePoint(chargingPower, chargingArrivals);

    result.forEach((hourlyPower) => {
      expect(parseFloat(hourlyPower)).toBeGreaterThanOrEqual(
        parseFloat(minTotal),
      );
      expect(parseFloat(hourlyPower)).toBeLessThanOrEqual(parseFloat(maxTotal));
    });
  });

  test('handles large numbers of arrivals', () => {
    const chargingPower = 22;
    const chargingArrivals = 1000;
    const result = simulateSingleChargePoint(chargingPower, chargingArrivals);

    expect(result.length).toBe(24);
    result.forEach((hourlyPower) => {
      expect(parseFloat(hourlyPower)).toBeGreaterThanOrEqual(0);
    });
  });

  test('ensures output values are strings with two decimal places', () => {
    const chargingPower = 11;
    const chargingArrivals = 50;
    const result = simulateSingleChargePoint(chargingPower, chargingArrivals);

    result.forEach((hourlyPower) => {
      expect(typeof hourlyPower).toBe('string');
      expect(hourlyPower).toMatch(/^\d+\.\d{2}$/);
    });
  });
});
