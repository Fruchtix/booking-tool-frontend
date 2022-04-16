import { createContext, useContext } from 'react';
import Timeslot from '../interfaces/Timeslot';

type TimeslotContext = {
  timeslots: Array<Timeslot>;
  updateTimeslot: (timeslot: Timeslot) => void;
};

const timeslotContextDefaultValues: TimeslotContext = {
  timeslots: [],
  updateTimeslot: () => {},
};

const TimeslotContext = createContext<TimeslotContext>(timeslotContextDefaultValues);

export function useTimeslots() {
  return useContext(TimeslotContext);
}

export default TimeslotContext;
