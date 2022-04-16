import axios from 'axios';
import { useState } from 'react';
import TimeslotContext from '../context/TimeslotContext';
import Timeslot from '../interfaces/Timeslot';

type Props = {
  fetchedTimeslots: Array<Timeslot>;
  children: React.ReactNode;
};

export const TimeslotProvider = ({ fetchedTimeslots, children }: Props) => {
  const [timeslots, setTimeslots] = useState<Array<Timeslot>>([...fetchedTimeslots]);

  const updateTimeslot = async (timeslot: Timeslot) => {
    const timeslotsWithoutCurrentTimeslot = timeslots.filter(slot => slot.id !== timeslot.id);
    const isNewTimeslot = timeslotsWithoutCurrentTimeslot.length === timeslots.length;

    if (isNewTimeslot) {
      // Add Timeslot to dynamoDB
      await axios
        .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/add', {
          timeslot: timeslot,
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      // TODO: call aws update timeslot endpoint => create aws update lambda
    }

    setTimeslots([...timeslotsWithoutCurrentTimeslot, timeslot]);
  };

  const value = {
    timeslots,
    updateTimeslot,
  };

  return (
    <>
      <TimeslotContext.Provider value={value}>{children}</TimeslotContext.Provider>
    </>
  );
};
