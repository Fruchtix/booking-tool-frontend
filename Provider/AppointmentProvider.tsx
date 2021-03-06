import AppointmentContext from '../context/AppointmentContext';
import Appointment from '../interfaces/Appointment';

type Props = {
  appointments: Array<Appointment>;
  children: React.ReactNode;
};

export const AppointmentProvider = ({ appointments, children }: Props) => {
  const value = {
    appointments,
  };

  return (
    <>
      <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>
    </>
  );
};
