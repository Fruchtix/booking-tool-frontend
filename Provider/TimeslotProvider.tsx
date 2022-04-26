import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import TimeslotContext from '../context/TimeslotContext';
import Timeslot from '../interfaces/Timeslot';

type Props = {
  fetchedTimeslots: Array<Timeslot>;
  timeslotRangeStart: string;
  timeslotRangeEnd: string;
  children: React.ReactNode;
};

export const TimeslotProvider = ({ fetchedTimeslots, timeslotRangeStart, timeslotRangeEnd, children }: Props) => {
  const [timeslots, setTimeslots] = useState<Array<Timeslot>>([...fetchedTimeslots]);
  const [currentTimeslotRangeStart, setCurrentTimeslotRangeStart] = useState(timeslotRangeStart);
  const [currentTimeslotRangeEnd, setCurrentTimeslotRangeEnd] = useState(timeslotRangeEnd);

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

  const checkForNewTimeslots = async (date: Dayjs) => {
    const currentDate = date.clone();
    const bufferWeeks = 3;

    // check if old month needs to be loaded
    const rangeStartDate = dayjs(currentTimeslotRangeStart);
    if (currentDate.subtract(bufferWeeks, 'week').isBefore(rangeStartDate)) {
      const currentMinusOneMonth = rangeStartDate.subtract(1, 'month').format();
      const end = rangeStartDate.subtract(1, 'day').format();

      getTimeslots(currentMinusOneMonth, end).then(() => {
        setCurrentTimeslotRangeStart(currentMinusOneMonth);
      });
      return;
    }

    // check if next month needs to be loaded
    const rangeEndDate = dayjs(currentTimeslotRangeEnd);
    if (currentDate.add(bufferWeeks, 'week').isAfter(rangeEndDate)) {
      const currentPlusOneMonth = rangeEndDate.add(1, 'month').format();
      const start = rangeEndDate.add(1, 'day').format();

      getTimeslots(start, currentPlusOneMonth).then(() => {
        setCurrentTimeslotRangeEnd(currentPlusOneMonth);
      });
    }
  };

  const getTimeslots = async (start: string, end: string) => {
    console.log('load timeslots');

    return new Promise(async (resolve, reject) => {
      await axios
        .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/get', {
          params: {
            studioID: 'todo',
            rangeStartDate: start,
            rangeEndDate: end,
          },
        })
        .then(res => {
          setTimeslots(currentTimeslots => [...currentTimeslots, ...res.data]);
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  };

  const value = {
    timeslots,
    updateTimeslot,
    deleteTimeslot,
    deleteTimeslotSeries,
    getTimeslots,
    checkForNewTimeslots,
  };

  return (
    <>
      <TimeslotContext.Provider value={value}>{children}</TimeslotContext.Provider>
    </>
  );
};
