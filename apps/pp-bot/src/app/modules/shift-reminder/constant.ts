import { ShiftAction } from "./type";


export const shiftActionsPattern = Object.values(ShiftAction).join('|');
export const confirmShift = `${ShiftAction.Confirm}_shift`;
export const declineShift = `${ShiftAction.Decline}_shift`;