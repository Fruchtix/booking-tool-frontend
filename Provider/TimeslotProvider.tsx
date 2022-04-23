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
    return new Promise(async (resolve, reject) => {
      const timeslotsWithoutCurrentTimeslot = timeslots.filter(slot => slot.timeslotID !== timeslot.timeslotID);

      // Add/Update Timeslot in dynamoDB
      axios
        .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/add', {
          timeslot: timeslot,
          updateSeries: timeslot.repeats,
        })
        .then(res => {
          setTimeslots([...timeslotsWithoutCurrentTimeslot, ...res.data]);
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const deleteTimeslot = async (timeslot: Timeslot) => {
    return new Promise(async (resolve, reject) => {
      const timeslotsWithoutCurrentTimeslot = timeslots.filter(slot => slot.timeslotID !== timeslot.timeslotID);

      axios
        .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/delete', {
          timeslot: timeslot,
        })
        .then(() => {
          setTimeslots(timeslotsWithoutCurrentTimeslot);
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const value = {
    timeslots,
    updateTimeslot,
    deleteTimeslot,
  };

  return (
    <>
      <TimeslotContext.Provider value={value}>{children}</TimeslotContext.Provider>
    </>
  );
};
