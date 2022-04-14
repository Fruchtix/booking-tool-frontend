import { useEffect, useRef } from 'react';
import style from './CalendarWeekView.module.css';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  currentWeekDays: Array<Dayjs>;
}

const CalendarWeekView = ({ currentWeekDays }: Props) => {
  const slots = Array.from({ length: 24 }, (x, i) => i);
  const contentBody = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentHeight = contentBody.current?.offsetHeight || 0;
    const scrollFromTop = contentHeight * 1.125;

    contentBody.current?.scrollTo(0, scrollFromTop);
  }, []);

  const handleSlotdoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail !== 2) return;

    // TODO: check if appointment is in that timeslot
    // yes => open it in modal
    // no => open modal to create a new meeting

    e.currentTarget.style.background = 'red';
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
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;
