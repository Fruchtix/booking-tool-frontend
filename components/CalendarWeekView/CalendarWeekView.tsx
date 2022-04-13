import style from './CalendarWeekView.module.css';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  currentWeekDays: Array<Dayjs>;
}

const CalendarWeekView = ({ currentWeekDays }: Props) => {
  const hours = new Array(24).fill('hour');

  return (
    <div className={style['week-view']}>
      <div className={style['header']}>
        <div className={style['spacer']}></div>
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

      <div className={style['body']}>
        <div className={style['time-indicator']}>
          {hours.map((hour, index) => (
            <div key={index} className={style['unit']}>
              {index}
            </div>
          ))}
        </div>
        <div className={style['main']}>
          {currentWeekDays.map(day => (
            <div key={day.format()} className={style['day-column']}>
              {hours.map((hour, index) => (
                <div key={index} className={style['slot']}>
                  slot {index}
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
