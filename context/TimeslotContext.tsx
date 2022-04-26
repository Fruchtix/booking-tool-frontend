import { Dayjs } from 'dayjs';
import { createContext, useContext } from 'react';
import Timeslot from '../interfaces/Timeslot';

type TimeslotContext = {
  timeslots: Array<Timeslot>;
  updateTimeslot: (timeslot: Timeslot, updateSeries: boolean) => Promise<unknown>;
  deleteTimeslot: (timeslot: Timeslot) => Promise<unknown>;
  deleteTimeslotSeries: (timeslot: Timeslot) => Promise<unknown>;
  checkForNewTimeslots: (date: Dayjs) => Promise<unknown>;
};

const timeslotContextDefaultValues: TimeslotContext = {
  timeslots: [],
  updateTimeslot: () => new Promise(() => {}),
  deleteTimeslot: () => new Promise(() => {}),
  deleteTimeslotSeries: () => new Promise(() => {}),
  checkForNewTimeslots: () => new Promise(() => {}),
};

const TimeslotContext = createContext<TimeslotContext>(timeslotContextDefaultValues);

export function useTimeslots() {
  return useContext(TimeslotContext);
}

export default TimeslotContext;
