import TimeslotContext from '../context/TimeslotContext';
import Timeslot from '../interfaces/Timeslot';

type Props = {
  timeslots: Array<Timeslot>;
  children: React.ReactNode;
};

export const TimeslotProvider = ({ timeslots, children }: Props) => {
  const resetTimeslots = () => {
    console.log('resete');
  };

  const value = {
    timeslots,
    resetTimeslots,
  };

  return (
    <>
      <TimeslotContext.Provider value={value}>{children}</TimeslotContext.Provider>
    </>
  );
};
