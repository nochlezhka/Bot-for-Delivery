export type ExistShift = {
  dateStart: Date;
  id: string;
  status: ExistShiftStatus;
};
export type FreeShift = {
  dateStart: Date;
  status: FreeShiftStatus;
};

export type OwnShift = {
  accepted: boolean | null;
  dateStart: Date;
  id: string;
  status: ExistShiftStatus;
};
type ExistShiftStatus = 'busy' | 'free' | 'halfBusy' | 'weekend';
type FreeShiftStatus = 'free';
