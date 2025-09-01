import { EditFormProvider, EditFormProviderProps } from './EditFormProvider';
import {
  GenderField,
  NameField,
  PhoneField,
  RoleField,
  TgUseranmeField,
} from './fields';

export const ExistsUserCard = ({
  children,
  ...props
}: EditFormProviderProps) => {
  return (
    <EditFormProvider {...props}>
      <NameField />
      <PhoneField />
      <TgUseranmeField />
      <GenderField />
      <RoleField />
      <div className="flex empty:hidden">
        {children ?? <button className="btn w-full mt-1">Сохранить</button>}
      </div>
    </EditFormProvider>
  );
};
