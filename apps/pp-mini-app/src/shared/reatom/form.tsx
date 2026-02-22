'use client';
import { FieldAtom, FieldValidation, wrap } from '@reatom/core';
import { ChangeEvent, useCallback, useSyncExternalStore } from 'react';

type BaseGetInputProps = {
  onBlur: () => void;
  onFocus: () => void;
};

type InputType = 'checkbox' | 'text';

type UseCheckboxFormFieldReturn = {
  getInputProps: () => {
    checked: boolean;
    onChange: (ev: ChangeEvent<{ checked: boolean }>) => void;
  } & BaseGetInputProps;
} & FieldValidation;

type UseFormFieldReturn<State, Value = State> =
  | UseCheckboxFormFieldReturn
  | UseGenericFormFieldReturn<State, Value>
  | UseStringFormFieldReturn;
type UseGenericFormFieldReturn<State, Value = State> = {
  getInputProps: () => {
    onChange: (newState: Value) => void;
    value: State;
  } & BaseGetInputProps;
} & FieldValidation;

type UseStringFormFieldReturn = {
  getInputProps: () => {
    onChange: (ev: ChangeEvent<{ value: string }>) => void;
    value: string;
  } & BaseGetInputProps;
} & FieldValidation;
export function useFormField<State, Value>(
  model: FieldAtom<State, Value>
): UseGenericFormFieldReturn<State, Value>;
export function useFormField(
  model: FieldAtom<boolean>,
  type: 'checkbox'
): UseCheckboxFormFieldReturn;
// @ts-expect-error idk
export function useFormField(
  model: FieldAtom<string>,
  type: 'text'
): UseStringFormFieldReturn;
export function useFormField<State, Value = State>(
  model: FieldAtom,
  type?: InputType
): UseFormFieldReturn<State, Value> {
  const change = wrap(model.change);
  const focus = wrap(model.focus.in);
  const blur = wrap(model.focus.out);
  const value = useSyncExternalStore(model.value.subscribe, model.value);
  const validation = useSyncExternalStore(
    model.validation.subscribe,
    model.validation
  );

  const onBlur = useCallback(() => blur(), [blur]);
  const onFocus = useCallback(() => focus(), [focus]);
  const onChange = useCallback(
    (evOrVal: ChangeEvent<{ checked: Value } | { value: Value }> | Value) => {
      if (evOrVal && typeof evOrVal === 'object' && 'target' in evOrVal) {
        if (type === 'checkbox' && 'checked' in evOrVal.target)
          change(evOrVal.target.checked);
        else if ('value' in evOrVal.target) change(evOrVal.target.value);
      } else {
        change(evOrVal);
      }
    },
    [change, type]
  );

  const getInputProps = useCallback(
    () => ({
      onBlur,
      onChange,
      onFocus,
      value,
    }),
    [onChange, onBlur, onFocus, value]
  );

  return {
    getInputProps,
    ...validation,
  };
}
