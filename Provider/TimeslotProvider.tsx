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

  const updateTimeslot = async (timeslot: Timeslot, updateSeries: boolean) => {
    return new Promise(async (resolve, reject) => {
      // Add/Update Timeslot in dynamoDB
      axios
        .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/add', {
          timeslot: timeslot,
          updateSeries: updateSeries,
        })
        .then(res => {
          setTimeslots(currentTimeslots => [
            ...currentTimeslots.filter(slot => slot.timeslotID !== timeslot.timeslotID),
            ...res.data,
          ]);
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const deleteTimeslot = async (timeslot: Timeslot) => {
    return new Promise(async (resolve, reject) => {
      axios
        .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/delete', {
          timeslot: timeslot,
        })
        .then(() => {
          setTimeslots(currentTimeslots => currentTimeslots.filter(slot => slot.timeslotID !== timeslot.timeslotID));
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const deleteTimeslotSeries = async (timeslot: Timeslot) => {
    return new Promise(async (resolve, reject) => {
      axios
        .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/delete-series', {
          timeslot: timeslot,
        })
        .then(() => {
          setTimeslots(currentTimeslots => currentTimeslots.filter(slot => slot.seriesID !== timeslot.seriesID));
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
    deleteTimeslotSeries,
  };

  return (
    <>
      <TimeslotContext.Provider value={value}>{children}</TimeslotContext.Provider>
    </>
  );
};
