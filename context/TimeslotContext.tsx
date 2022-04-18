import { createContext, useContext } from 'react';
import Timeslot from '../interfaces/Timeslot';

type TimeslotContext = {
  timeslots: Array<Timeslot>;
  updateTimeslot: (timeslot: Timeslot) => Promise<unknown>;
  deleteTimeslot: (timeslot: Timeslot) => Promise<unknown>;
};

const timeslotContextDefaultValues: TimeslotContext = {
  timeslots: [],
  updateTimeslot: () => new Promise(() => {}),
  deleteTimeslot: () => new Promise(() => {}),
};

const TimeslotContext = createContext<TimeslotContext>(timeslotContextDefaultValues);

export function useTimeslots() {
  return useContext(TimeslotContext);
}

export default TimeslotContext;
