import { useState, useEffect } from 'react';
import CalendarControls from '../CalendarControls/CalendarControls';
import style from './Calendar.module.css';
import CalendarWeekView from '../CalendarWeekView/CalendarWeekView';
import dayjs from 'dayjs';
import de from 'dayjs/locale/de';

dayjs.locale({
  ...de,
  weekStart: 1,
});

const Calender = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [currentWeekDays, setCurrentWeekDays]: any[] = useState([]);

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

  return (
    <div className={style['calendar']}>
      <div className={style['container']}>
        <CalendarControls
          currentWeekDays={currentWeekDays}
          onPrevClick={handlePrevClick}
          onNextClick={handleNextClick}
          onTodayClick={handleTodayClick}
        />

        <CalendarWeekView currentWeekDays={currentWeekDays} />
      </div>
    </div>
  );
};

export default Calender;
