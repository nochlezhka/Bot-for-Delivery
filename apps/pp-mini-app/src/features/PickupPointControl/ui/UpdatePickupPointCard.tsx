import { EditFormProvider, EditFormProviderProps } from './EditFormProvider';
import {
  AddressField,
  DescriptionField,
  NameField,
  ScheduleField,
} from './fields';

export const UpdatePickupPointCard = ({
  children,
  ...props
}: EditFormProviderProps) => {
  return (
    <EditFormProvider {...props}>
      <NameField />
      <AddressField />
      <ScheduleField />
      <DescriptionField />
      <div className="flex empty:hidden">
        {children ?? <button className="btn w-full mt-1">Сохранить</button>}
      </div>
    </EditFormProvider>
  );
};
