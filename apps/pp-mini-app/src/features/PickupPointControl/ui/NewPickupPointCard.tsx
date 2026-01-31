import {
  CreateFormProvider,
  CreateFormProviderProps,
} from './CreateFormProvider';
import {
  AddressField,
  DescriptionField,
  NameField,
  ScheduleField,
} from './fields';

export const NewPickupPointCard = ({
  children,
  ...props
}: CreateFormProviderProps) => {
  return (
    <CreateFormProvider {...props}>
      <NameField />
      <AddressField />
      <ScheduleField />
      <DescriptionField />
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
