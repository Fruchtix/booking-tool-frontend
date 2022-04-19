import React, { useState, useEffect } from 'react';
import CalendarControls from '../CalendarControls/CalendarControls';
import style from './Calendar.module.css';
import CalendarWeekView from '../CalendarWeekView/CalendarWeekView';
import dayjs from 'dayjs';
import de from 'dayjs/locale/de';
import Appointment from '../../interfaces/Appointment';
import CalendarAppointmentModal from '../CalendarAppointmentModal/CalendarAppointmentModal';
import CalendarTimeslotModal from '../CalendarTimeslotModal/CalendarTimeslotModal';
import Timeslot from '../../interfaces/Timeslot';

dayjs.locale({
  ...de,
  weekStart: 1,
});

const Calender = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [currentWeekDays, setCurrentWeekDays] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot | null>(null);
  const [hideTimeslots, setHideTimeslots] = useState(false);
  const [isNewTimeslot, setIsNewTimeslot] = useState(false);

  useEffect(() => {
    const currentWeekStart = currentDate.startOf('week');
    const daysInWeek = new Array(7).fill(currentWeekStart).map((day, index) => day.add(index, 'day'));

    setCurrentWeekDays(daysInWeek);
  }, [currentDate]);

  const handlePrevClick = () => {
    setCurrentDate(currentDate => currentDate.subtract(7, 'day'));
  };

  const handleNextClick = () => {
    setCurrentDate(currentDate => currentDate.add(7, 'day'));
  };

  const handleTodayClick = () => {
    setCurrentDate(dayjs());
  };

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const openTimeslotDetails = (timeslot: Timeslot, isNew = false) => {
    setIsNewTimeslot(isNew);
    setSelectedTimeslot(timeslot);
  };

  const handleHideTimeslotsClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHideTimeslots(e.currentTarget.checked);
  };

  return (
    <div className={style['calendar']}>
      <div className={style['container']}>
        <CalendarControls
          currentWeekDays={currentWeekDays}
          onPrevClick={handlePrevClick}
          onNextClick={handleNextClick}
          onTodayClick={handleTodayClick}
          onHideTimeslotsClick={handleHideTimeslotsClick}
        />

        {selectedAppointment && (
          <CalendarAppointmentModal appointment={selectedAppointment} closeModal={() => setSelectedAppointment(null)} />
        )}

        {selectedTimeslot && (
          <CalendarTimeslotModal
            timeslot={selectedTimeslot}
            isNew={isNewTimeslot}
            closeModal={() => setSelectedTimeslot(null)}
          />
        )}

        <CalendarWeekView
          currentWeekDays={currentWeekDays}
          openAppointmentDetails={openAppointmentDetails}
          openTimeslotDetails={openTimeslotDetails}
          hideTimeslots={hideTimeslots}
        />
      </div>
    </div>
  );
};

export default Calender;
