import React from 'react';
import { FieldArray, FormikErrors } from 'formik';

import {
  CharginPowerFieldsWrapper,
  CharginPowerFieldWrapper,
  FormContainer,
} from './style';
import { InputField } from '../../components/inputField';
import { Button, ButtonWrapper, Label } from '../../globalStyles/styles';
import { ErrorMessage, Input } from '../../components/inputField/style';
import { FormType, simulateSingleChargePoint } from './metaData';
import { DeleteIcon } from 'assets';

interface FormComponentPropsType {
  values: FormType;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<FormType>>;
  chargingStationsAvailable: number;
  setFieldError: (field: string, message: string | undefined) => void;
  errors: FormikErrors<FormType>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  setAggregatedChargingValuesData: React.Dispatch<
    React.SetStateAction<string[][]>
  >;
  chargingArrivals: number;
  arrivalMultiplier: number;
}

// form created only for code cleaning purpose
export const Form = ({
  values,
  setFieldValue,
  chargingStationsAvailable,
  setFieldError,
  errors,
  handleSubmit,
  setAggregatedChargingValuesData,
  chargingArrivals,
  arrivalMultiplier,
}: FormComponentPropsType) => {
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
      <FieldArray name="chargingPower">
        {({ push, remove }) => {
          return (
            <>
              <Label>Charging Power Booths: </Label>
              <CharginPowerFieldsWrapper>
                {values.chargingPower.map((field, index) => (
                  <CharginPowerFieldWrapper key={index}>
                    <Label width="75px">Power (kW): </Label>
                    <Input
                      type={'number'}
                      value={field[0]}
                      onChange={(e) =>
                        setFieldValue(
                          `chargingPower[${index}][0]`,
                          Number(e.target.value),
                        )
                      }
                      min={5}
                      max={20}
                    />
                    <Label width="186px">Number of Charging Booths: </Label>
                    <Input
                      type={'number'}
                      value={field[1]}
                      onChange={(e) => {
                        const alreadyCreated = values.chargingPower.reduce(
                          (acc, val, i) => {
                            if (i === index)
                              return acc + Number(e.target.value);
                            return acc + val[1];
                          },
                          0,
                        );
                        if (alreadyCreated > chargingStationsAvailable) {
                          setFieldError(
                            `chargingPower`,
                            'Cannot add more than 20',
                          );
                        } else {
                          setFieldValue(
                            `chargingPower[${index}][1]`,
                            Number(e.target.value),
                          );
                        }
                      }}
                      min={0}
                      max={20}
                    />

                    {index ? (
                      <div
                        className="remove-button"
                        onClick={() => {
                          remove(index);
                          const chargingPower = values.chargingPower.filter(
                            (_, i) => i !== index,
                          );
                          const adjustedChargingArrivals = Math.round(
                            chargingArrivals +
                              (chargingArrivals * arrivalMultiplier) / 100,
                          );
                          const aggregatedChargingValues = chargingPower.map(
                            (charger) =>
                              simulateSingleChargePoint(
                                charger[0] * charger[1],
                                adjustedChargingArrivals,
                              ),
                          );
                          setAggregatedChargingValuesData(
                            aggregatedChargingValues,
                          );
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    ) : null}
                  </CharginPowerFieldWrapper>
                ))}
                <ButtonWrapper>
                  <Button onClick={() => push([11, 0])}>Add +</Button>
                </ButtonWrapper>
                {errors.chargingPower && (
                  <ErrorMessage>{errors.chargingPower}</ErrorMessage>
                )}
              </CharginPowerFieldsWrapper>
            </>
          );
        }}
      </FieldArray>

      <InputField
        label="Arrival Probability Multiplier (%):"
        name="arrivalMultiplier"
        min={20}
        max={200}
      />
      <ButtonWrapper>
        <Button
          onClick={() => handleSubmit()}
          disabled={Boolean(Object.keys(errors).length)}
        >
          Submit
        </Button>
      </ButtonWrapper>
    </FormContainer>
  );
};
