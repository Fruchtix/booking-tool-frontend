import style from './CalendarControls.module.css';

const CalendarControls = () => {
  return (
    <div className={style['control-bar']}>
      <div className={style['left']}>
        <div className={style['']}>Today</div>
        <div className={style['next-prev-btns']}>
          <span>&lt;</span>
          <span>&gt;</span>
        </div>
        <div className={style['']}>4 April - 10 April 2022</div>
      </div>

      <div className={style['right']}>
        <select id="calendar-type" name="calendar-type">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
    </div>
  );
};

export default CalendarControls;
