import dayjs from 'dayjs';
import React from 'react';
import Timeslot from '../../interfaces/Timeslot';
import style from './CalendarTimeslotEntries.module.css';

interface Props {
  entries: Array<Timeslot>;
  handleDoubleClick: (e: React.MouseEvent<HTMLElement>, entry: Timeslot) => void;
  currentWeekDays: dayjs.Dayjs[];
}

const CalendarTimeslotEntries = ({ entries, handleDoubleClick, currentWeekDays }: Props) => {
  const firstDayOfNextWeek = currentWeekDays[currentWeekDays.length - 1].clone().add(1, 'day');
  const lastDayOfLastWeek = currentWeekDays[0].clone().subtract(1, 'day');

  return (
    <div className={style['entries']}>
      {entries.map(entry => {
        const startDate = dayjs(entry.start);

        const isBefore = startDate.isBefore(firstDayOfNextWeek, 'day');
        const isAfter = startDate.isAfter(lastDayOfLastWeek, 'day');
        const entryIsInCurrentWeek = isBefore && isAfter;

        if (!entryIsInCurrentWeek) {
          return null;
        }

        const endDate = dayjs(entry.end);
        const column = startDate.weekday();
        const startHour = startDate.hour() + startDate.minute() / 60;
        let endHour = endDate.hour() + endDate.minute() / 60;

        if (endHour === 0) {
          endHour = 24;
        }

        return (
          <div
            key={entry.timeslotID}
            className={`${style['entry']} pointer ${style['timeslot']}`}
            data-column={column}
            data-start={startHour}
            style={{
              top: `calc(100% / 8 * ${startHour})`,
              transform: `translateX(${column}00%)`,
              height: `calc(100% / 8 * ${endHour - startHour})`,
            }}
            onClick={e => handleDoubleClick(e, entry)}
          >
            Free
          </div>
        );
      })}
    </div>
  );
};

export default CalendarTimeslotEntries;
