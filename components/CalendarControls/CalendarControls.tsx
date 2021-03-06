import React from 'react';
import { useStudio } from '../../context/StudioContext';
import style from './CalendarControls.module.css';

interface Props {
  currentWeekDays: any[];
  onPrevClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
  onHideTimeslotsClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CalendarControls = ({ currentWeekDays, onPrevClick, onNextClick, onTodayClick, onHideTimeslotsClick }: Props) => {
  const { studioData, selectedTattooer, setSelectedTattooer } = useStudio();

  const handleTattooerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedArtist = studioData.tattooer[e.target.selectedIndex];

    setSelectedTattooer(newSelectedArtist);
  };

  return (
    <div className={style['control-bar']}>
      <div className={style['left']}>
        <div className={`${style['']} pointer`} onClick={onTodayClick}>
          Today
        </div>
        <div className={style['next-prev-btns']}>
          <span className={`pointer`} onClick={onPrevClick}>
            &lt;
          </span>
          <span className={`pointer`} onClick={onNextClick}>
            &gt;
          </span>
        </div>
        <div className={style['']}>{`${currentWeekDays[0]?.format('DD MMMM')} - ${currentWeekDays[6]?.format(
          'DD MMMM YYYY'
        )}`}</div>

        <select onChange={handleTattooerChange} value={selectedTattooer.tattooerID} name="tattooer" id="tattooer">
          {studioData?.tattooer?.map(tattooer => (
            <option key={tattooer.tattooerID} value={tattooer.tattooerID}>
              {tattooer.name}
            </option>
          ))}
        </select>
      </div>

      <div className={style['right']}>
        <div>
          <input type="checkbox" name="hide-timeslots" id="hide-timeslots" onChange={onHideTimeslotsClick} />
          <label htmlFor="hide-timeslots">Hide open timeslots</label>
        </div>
        <select id="calendar-type" name="calendar-type" defaultValue={'week'}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
    </div>
  );
};

export default CalendarControls;
