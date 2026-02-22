import { Editable } from '@ark-ui/react/editable';
import { reatomComponent } from '@reatom/react';
import { clsx } from 'clsx';

type ChangeValueCb = ({ value }: { value: number }) => unknown;

type InputWithDefalt = {
  defaultValue?: number;
  onValueChange?: ChangeValueCb;
  onValueCommit?: ChangeValueCb;
} & Pick<Editable.RootProps, 'className' | 'placeholder'>;

type InputWithValue = {
  onValueChange?: ChangeValueCb;
  onValueCommit?: ChangeValueCb;
} & Pick<Editable.RootProps, 'className' | 'placeholder' | 'value'>;

interface TextFieldProp extends InputWithDefalt, InputWithValue {
  error: false | null | string | undefined;
  name: string;
}

export const NumberField = reatomComponent(
  ({
    className,
    defaultValue,
    error,
    name,
    onValueChange,
    onValueCommit,
    value,
    ...props
  }: TextFieldProp) => (
    <fieldset className="fieldset">
      {name ? <legend className="fieldset-legend">{name}</legend> : <></>}
      <Editable.Root
        className={clsx('form-control', className)}
        defaultValue={defaultValue ? String(defaultValue) : undefined}
        value={value ? String(value) : undefined}
        {...props}
        onValueChange={({ value }) => {
          const res = Number(value);
          if (isNaN(res)) {
            onValueChange?.({ value: 0 });
          } else {
            onValueChange?.({ value: res });
          }
        }}
        onValueCommit={({ value }) => {
          const res = Number(value);
          if (isNaN(res)) {
            onValueCommit?.({ value: 0 });
          } else {
            onValueCommit?.({ value: res });
          }
        }}
      >
        <Editable.Preview className="input input-bordered w-full data-placeholder-shown:text-base-content/30" />
        <Editable.Input className="input input-bordered w-full" />
      </Editable.Root>
      {error ? <div className="text-error">{error}</div> : <></>}
    </fieldset>
  )
);
