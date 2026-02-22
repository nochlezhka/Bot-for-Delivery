import { Editable } from '@ark-ui/react/editable';
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

export const TextAreaField = ({
  className,
  error,
  name,
  ...props
}: TextFieldProp) => (
  <fieldset className="fieldset">
    {name ? <legend className="fieldset-legend">{name}</legend> : <></>}
    <Editable.Root className={clsx('form-control', className)} {...props}>
      <Editable.Preview
        asChild
        className="textarea w-full data-placeholder-shown:text-base-content/30"
      >
        <textarea readOnly style={{ resize: 'none' }} />
      </Editable.Preview>
      <Editable.Input
        asChild
        className="textarea w-full"
        style={{ resize: 'none' }}
      >
        <textarea />
      </Editable.Input>
    </Editable.Root>
    {error ? <div className="text-error">{error}</div> : <></>}
  </fieldset>
);
