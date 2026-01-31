type FreeShiftStatus = 'free';
export type FreeShift = {
  status: FreeShiftStatus;
  dateStart: Date;
};

type ExistShiftStatus = 'halfBusy' | 'busy' | 'weekend' | 'free';
export type ExistShift = {
  id: string;
  status: ExistShiftStatus;
  dateStart: Date;
};
export type OwnShift = {
  id: string;
  status: ExistShiftStatus;
  dateStart: Date;
  accepted: boolean | null;
};
