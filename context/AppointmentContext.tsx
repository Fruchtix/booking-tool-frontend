import { createContext, useContext } from 'react';
import Appointment from '../interfaces/Appointment';

type AppointmentContext = {
  appointments: Array<Appointment>;
  resetAppointments: () => void;
};

const appointmentContextDefaultValues: AppointmentContext = {
  appointments: [],
  resetAppointments: () => {},
};

const AppointmentContext = createContext<AppointmentContext>(appointmentContextDefaultValues);

export function useAppointments() {
  return useContext(AppointmentContext);
}

export default AppointmentContext;
