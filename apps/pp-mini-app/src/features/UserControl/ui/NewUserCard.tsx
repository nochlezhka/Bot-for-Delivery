import {
  CreateFormProvider,
  CreateFormProviderProps,
} from './CreateFormProvider';
import {
  GenderField,
  NameField,
  PhoneField,
  RoleField,
  TgUseranmeField,
} from './fields';

export const NewUserCard = ({
  children,
  ...props
}: CreateFormProviderProps) => {
  return (
    <CreateFormProvider {...props}>
      <NameField />
      <PhoneField />
      <TgUseranmeField />
      <GenderField />
      <RoleField />
      <div className="flex empty:hidden">
        {children ?? (
          <button className="btn w-full mt-1" type="submit">
            Сохранить
          </button>
        )}
      </div>
    </CreateFormProvider>
  );
};
