import CalendarControls from '../CalendarControls/CalendarControls';
import style from './Calendar.module.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Calender = () => {
  return (
    <div className={style['calendar']}>
      <CalendarControls />

      <div className={style['header']}>
        {daysOfWeek.map(day => (
          <div key={day} className={style['row-header']}>
            <p className={style['day-number']}>1</p>
            <p className={style['day-name']}>{day}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calender;
