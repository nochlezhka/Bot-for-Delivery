import { Editable } from '@ark-ui/react/editable';
import { reatomComponent } from '@reatom/react';
import { clsx } from 'clsx';

type InputWithDefalt = Pick<
  Editable.RootProps,
  | 'className'
  | 'defaultValue'
  | 'onValueChange'
  | 'onValueCommit'
  | 'placeholder'
>;

type InputWithValue = Pick<
  Editable.RootProps,
  'className' | 'onValueChange' | 'onValueCommit' | 'placeholder' | 'value'
>;
interface TextFieldProp extends InputWithDefalt, InputWithValue {
  error: false | null | string | undefined;
  name: string;
}

export const TextField = reatomComponent(
  ({ className, error, name, ...props }: TextFieldProp) => (
    <fieldset className="fieldset">
      {name ? <legend className="fieldset-legend">{name}</legend> : <></>}
      <Editable.Root className={clsx('form-control', className)} {...props}>
        <Editable.Preview className="input input-bordered w-full data-placeholder-shown:text-base-content/30" />
        <Editable.Input className="input input-bordered w-full" />
      </Editable.Root>
      {error ? <div className="text-error">{error}</div> : <></>}
    </fieldset>
  )
);
