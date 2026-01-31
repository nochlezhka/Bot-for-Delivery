'use client';
import { RadioGroup } from '@ark-ui/react/radio-group';
import { users } from 'pickup-point-db/browser';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { GENDER_NAMES, GENDER_VALUES } from '@/entity/user/constant';

import { UserFormContext } from '../../Context';

export const GenderField = () => {
  const { control } = useFormContext<users>();
  const { field, fieldState } = useController({ control, name: 'gender' });

  const { trigerFieldSubmit } = useContext(UserFormContext);
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Пол</legend>
      <div className="flex items-center space-x-4">
        <RadioGroup.Root
          className="flex items-center space-x-2"
          defaultValue={field.value}
          onValueChange={({ value }) => {
            field.onChange(value);
            trigerFieldSubmit('gender');
          }}
        >
          {GENDER_VALUES.map((gender) => (
            <RadioGroup.Item
              className="flex items-center"
              key={gender}
              value={gender}
            >
              <RadioGroup.ItemText>{GENDER_NAMES[gender]}</RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput className="radio! ml-1!" />
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>

      {fieldState.error?.message ? (
        <div className="text-error">{fieldState.error.message}</div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};
