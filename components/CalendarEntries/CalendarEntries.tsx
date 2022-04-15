import dayjs from 'dayjs';
import React from 'react';
import Appointment from '../../interfaces/Appointment';
import Timeslot from '../../interfaces/Timeslot';
import style from './CalendarEntries.module.css';

interface Props {
  entries: Array<Appointment | Timeslot>;
  handleDoubleClick: (e: React.MouseEvent<HTMLElement>, entry: Appointment | Timeslot) => void;
  isTimeslot: boolean;
}

const CalendarEntries = ({ entries, handleDoubleClick, isTimeslot }: Props) => {
  return (
    <div className={style['entries']}>
      {entries.map(entry => {
        const startDate = dayjs(entry.start);
        const endDate = dayjs(entry.end);
        const column = startDate.day();
        const startHour = startDate.hour() + startDate.minute() / 60;
        const endHour = endDate.hour() + endDate.minute() / 60;

        const appointmentEntry = entry as Appointment;

        return (
          <div
            key={entry.id}
            className={`${style['entry']} pointer ${isTimeslot ? style['timeslot'] : null}`}
            data-column={column}
            data-start={startHour}
            style={{
              top: `calc(100% / 8 * ${startHour})`,
              transform: `translateX(${column - 1}00%)`,
              height: `calc(100% / 8 * ${endHour - startHour})`,
            }}
            onClick={e => handleDoubleClick(e, entry)}
          >
            {appointmentEntry.heading || ''}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarEntries;
