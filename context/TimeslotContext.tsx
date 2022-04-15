import { createContext, useContext } from 'react';
import Timeslot from '../interfaces/Timeslot';

type TimeslotContext = {
  timeslots: Array<Timeslot>;
  resetTimeslots: () => void;
};

const timeslotContextDefaultValues: TimeslotContext = {
  timeslots: [],
  resetTimeslots: () => {},
};

const TimeslotContext = createContext<TimeslotContext>(timeslotContextDefaultValues);

export function useTimeslots() {
  return useContext(TimeslotContext);
}

export default TimeslotContext;
