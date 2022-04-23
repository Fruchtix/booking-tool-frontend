import React, { useEffect, useRef, useState } from 'react';
import style from './CalendarWeekView.module.css';
import dayjs, { Dayjs } from 'dayjs';
import Appointment from '../../interfaces/Appointment';
import Timeslot from '../../interfaces/Timeslot';
import { v4 as uuidv4 } from 'uuid';
import CalendarAppointmentEntries from '../CalendarAppointmentEntries/CalendarAppointmentEntries';
import { useTimeslots } from '../../context/TimeslotContext';
import { useAppointments } from '../../context/AppointmentContext';
import CalendarTimeslotEntries from '../CalendarTimeslotEntries.tsx/CalendarTimeslotEntries';

interface Props {
  currentWeekDays: Array<Dayjs>;
  openAppointmentDetails: (appointment: Appointment) => void;
  openTimeslotDetails: (timeslot: Timeslot, isNew?: boolean) => void;
  hideTimeslots: boolean;
}

const CalendarWeekView = ({ currentWeekDays, openAppointmentDetails, openTimeslotDetails, hideTimeslots }: Props) => {
  const [isScrolledIntoView, setIsScrolledIntoView] = useState(false);
  const { timeslots } = useTimeslots();
  const { appointments } = useAppointments();
  const slots = Array.from({ length: 24 }, (x, i) => i);
  const contentBody = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentHeight = contentBody.current?.offsetHeight || 0;
    const scrollFromTop = contentHeight * 1.125;

    contentBody.current?.scrollTo(0, scrollFromTop);
    setIsScrolledIntoView(true);
  }, []);

  const handleSlotdoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail !== 2) return;

    const { day, hour, minute } = e.currentTarget.dataset;

    const timeslotStart = dayjs(day).hour(Number(hour)).minute(Number(minute)).format();
    const timeslotEnd = dayjs(timeslotStart).add(1, 'hour').format();

    const newTimeslot: Timeslot = {
      timeslotID: uuidv4(),
      tattooerID: 'todo',
      studioID: 'todo',
      start: timeslotStart,
      end: timeslotEnd,
    };

    openTimeslotDetails(newTimeslot, true);
  };

  const handleAppointmentDoubleClick = (e: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    if (e.detail !== 2) return;

    openAppointmentDetails(appointment as Appointment);
  };

  const handleTimeslotDoubleClick = (e: React.MouseEvent<HTMLElement>, timeslot: Timeslot) => {
    if (e.detail !== 2) return;

    openTimeslotDetails(timeslot);
  };

  return (
    <div className={style['week-view']}>
      <div className={style['header']}>
        {currentWeekDays.map(day => {
          const isCurrentDay = day.isSame(dayjs(), 'day');

          return (
            <div key={day.format()} className={style['row-header']}>
              <p className={`${style['day-number']} ${isCurrentDay ? style['day-number-current-day'] : null}`}>
                {day.date()}
              </p>
              <p className={`${style['day-name']} ${isCurrentDay ? style['day-name-current-day'] : null}`}>
                {day.format('dddd')}
              </p>
            </div>
          );
        })}
      </div>

      <div className={style['body']} ref={contentBody}>
        <div className={style['time-indicator']}>
          {slots.map(hour => (
            <div key={hour} className={style['unit']}>
              <span>{hour}</span>
            </div>
          ))}
        </div>
        <div className={style['main']}>
          {currentWeekDays.map(day => (
            <div key={day.format()} className={style['day-column']}>
              {slots.map((slot, index) => (
                <div key={index} className={style['slot']}>
                  <div
                    className={style['first-half']}
                    data-hour={index}
                    data-minute={0}
                    data-day={day.format()}
                    onClick={handleSlotdoubleClick}
                  ></div>
                  <div
                    className={style['second-half']}
                    data-hour={index}
                    data-minute={30}
                    data-day={day.format()}
                    onClick={handleSlotdoubleClick}
                  ></div>
                </div>
              ))}
            </div>
          ))}
          {isScrolledIntoView && (
            <CalendarAppointmentEntries
              entries={appointments}
              currentWeekDays={currentWeekDays}
              handleDoubleClick={handleAppointmentDoubleClick}
            />
          )}
          {isScrolledIntoView && !hideTimeslots && (
            <CalendarTimeslotEntries
              entries={timeslots}
              currentWeekDays={currentWeekDays}
              handleDoubleClick={handleTimeslotDoubleClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;
