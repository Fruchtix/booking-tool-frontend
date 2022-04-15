import React, { useEffect, useRef, useState } from 'react';
import style from './CalendarWeekView.module.css';
import dayjs, { Dayjs } from 'dayjs';
import Appointment from '../../interfaces/Appointment';
import Timeslot from '../../interfaces/Timeslot';

interface Props {
  currentWeekDays: Array<Dayjs>;
  appointments: Array<Appointment>;
  openAppointmentDetails: (appointment: Appointment) => void;
  openTimeslotDetails: (timeslot: Timeslot) => void;
}

const CalendarWeekView = ({ currentWeekDays, appointments, openAppointmentDetails, openTimeslotDetails }: Props) => {
  const [appointmentsVisible, setAppointmentsVisible] = useState(false);
  const slots = Array.from({ length: 24 }, (x, i) => i);
  const contentBody = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentHeight = contentBody.current?.offsetHeight || 0;
    const scrollFromTop = contentHeight * 1.125;

    contentBody.current?.scrollTo(0, scrollFromTop);
    setAppointmentsVisible(true);
  }, []);

  const handleSlotdoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail !== 2) return;

    const newTimeslot: Timeslot = {
      id: '1234',
      tattooerId: '11',
      start: '1',
      end: '1',
    };

    // TODO: get start date of clicked timeslot
    // TODO: checkout uuid for timeslot id
    // TODO: render timeslots in the same way as appointments
    // TODO: enhance timeslot modal to configure start, end, repeating
    // TODO: save timeslot to DB => trigger aws lambda after creation
    // TODO: write aws lambda to save timeslot in DB
    // TODO: get timeslots in getsersideprops

    e.currentTarget.style.background = 'green';

    openTimeslotDetails(newTimeslot);
  };

  const handleAppointmentDoubleClick = (e: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    if (e.detail !== 2) return;

    openAppointmentDetails(appointment);
  };

  return (
    <div className={style['week-view']}>
      <div className={style['header']}>
        {currentWeekDays.map(day => {
          const isCurrentDay = day.date() === dayjs().date();

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
                  <div className={style['first-half']} onClick={handleSlotdoubleClick}></div>
                  <div className={style['second-half']} onClick={handleSlotdoubleClick}></div>
                </div>
              ))}
            </div>
          ))}
          {appointmentsVisible && (
            <div className={style['appointments']}>
              {appointments.map(appointment => {
                const startDate = dayjs(appointment.start);
                const endDate = dayjs(appointment.end);
                const column = startDate.day();
                const startHour = startDate.hour() + startDate.minute() / 60;
                const endHour = endDate.hour() + endDate.minute() / 60;

                return (
                  <div
                    key={appointment.id}
                    className={`${style['appointment']} pointer`}
                    data-column={column}
                    data-start={startHour}
                    style={{
                      top: `calc(100% / 8 * ${startHour})`,
                      transform: `translateX(${column - 1}00%)`,
                      height: `calc(100% / 8 * ${endHour - startHour})`,
                    }}
                    onClick={e => handleAppointmentDoubleClick(e, appointment)}
                  >
                    {appointment.heading}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;
