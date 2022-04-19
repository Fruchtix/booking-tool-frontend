import React, { useState } from 'react';
import style from './CalendarTimeslotModal.module.css';
import Timeslot from '../../interfaces/Timeslot';
import dayjs from 'dayjs';
import { useTimeslots } from '../../context/TimeslotContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

interface Props {
  timeslot: Timeslot;
  closeModal: () => void;
  isNew: boolean;
  currentWeekDays: any[];
}

const CalendarTimeslotModal = ({ timeslot, closeModal, isNew, currentWeekDays }: Props) => {
  const { updateTimeslot, deleteTimeslot } = useTimeslots();
  const [hasChanged, setHasChanged] = useState(false);
  const [currentTimeslot, setCurrentTimeslot] = useState<Timeslot>(timeslot);
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [repeatingDays, setRepeatingDays] = useState<Array<number>>([dayjs(currentTimeslot.start).day()]);
  const [confirmModalSuccessFunction, setConfirmModalSuccessFunction] = useState<() => void>(() => {});

  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;

    closeModal();
  };

  const saveTimeslot = async () => {
    if (hasChanged || isNew) {
      setIsLoading(true);
      setDisplayError(false);

      try {
        await updateTimeslot(currentTimeslot);
        setIsLoading(false);
      } catch (error: any) {
        handleError(error);
        return;
      }
    }

    closeModal();
  };

  const deleteCurrentTimeslot = async () => {
    setIsLoading(true);

    try {
      await deleteTimeslot(currentTimeslot);
      setIsLoading(false);
    } catch (error: any) {
      handleError(error);
      return;
    }

    closeModal();
  };

  const handleError = (error: any) => {
    console.log(error);
    setIsLoading(false);
    setDisplayError(true);
  };

  const onDeleteBtnClick = () => {
    if (isNew) {
      closeModal();
      return;
    }

    setConfirmModalSuccessFunction(() => deleteCurrentTimeslot);
    setIsConfirmModalVisible(true);
  };

  const handleStartTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    const [start, end] = e.currentTarget.value.split(':');

    setCurrentTimeslot(timeslot => ({
      ...timeslot,
      start: dayjs(timeslot.start)
        .hour(+start)
        .minute(+end)
        .format(),
    }));

    setHasChanged(true);
  };

  const handleEndTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    const [start, end] = e.currentTarget.value.split(':');

    setCurrentTimeslot(timeslot => ({
      ...timeslot,
      end: dayjs(timeslot.end)
        .hour(+start)
        .minute(+end)
        .format(),
    }));

    setHasChanged(true);
  };

  const handleRepeatingDayClick = (dayInWeek: number) => {
    setRepeatingDays(repeatingDays => {
      const newRepeatingDays = [...repeatingDays];
      const index = repeatingDays.indexOf(dayInWeek);

      if (index > -1) {
        newRepeatingDays.splice(index, 1);
      } else {
        newRepeatingDays.push(dayInWeek);
      }

      return newRepeatingDays;
    });
  };

  const handleRepeatingChange = () => {
    setShouldRepeat(shouldRepeat => !shouldRepeat);
  };

  return (
    <>
      <div className={style['calendar-modal']} onClick={handleOutsideClick}>
        <div className={style['modal-content']}>
          <div className={style['start-wrapper']}>
            <label htmlFor="start-time">start:</label>
            <input
              onChange={handleStartTimeChange}
              type="time"
              id="start-time"
              name="start-time"
              value={`${dayjs(currentTimeslot.start).format('HH')}:${dayjs(currentTimeslot.start).format('mm')}`}
              required
            />
          </div>
          <div className={style['end-wrapper']}>
            <label htmlFor="end-time">end:</label>
            <input
              onChange={handleEndTimeChange}
              type="time"
              id="end-time"
              name="end-time"
              value={`${dayjs(currentTimeslot.end).format('HH')}:${dayjs(currentTimeslot.end).format('mm')}`}
              required
            />
          </div>
          <div className={style['repeating-wrapper']}>
            {/* TODO: send repeating infos to aws */}
            {/* TODO: open confirm modal when closing it without saving */}
            {/* TODO: add until field in repeating */}
            {/* TODO: when creating free timeslot check if other timeslot is during that time */}
            <label htmlFor="repeating">repeats:</label>
            <select
              value={shouldRepeat ? 'weekly' : 'noRepeat'}
              name="repeating"
              id="repeating"
              onChange={handleRepeatingChange}
            >
              <option value="noRepeat">Does not repeat</option>
              <option value="weekly">weekly</option>
            </select>

            {shouldRepeat && (
              <div className={style['repeating-days-wrapper']}>
                <label htmlFor="days">On</label>
                <div className={style['days']} id="days">
                  {currentWeekDays.map(day => {
                    const dayInWeek = day.day();
                    const isSelected = repeatingDays.includes(dayInWeek);

                    return (
                      <span
                        key={day.format()}
                        className={`${style['day']} ${isSelected ? style['selected'] : null} pointer`}
                        onClick={() => handleRepeatingDayClick(dayInWeek)}
                      >
                        {day.format('dd')}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div onClick={closeModal} className={style['close']}>
            x
          </div>
          {displayError && <div>Sorry an error ahas occured, please submit again...</div>}
          <div>
            <button type="button" onClick={saveTimeslot}>
              save
            </button>
            <button type="button" onClick={onDeleteBtnClick}>
              delete
            </button>
          </div>
          {isLoading && <div>It is loading motherfukcer</div>}
        </div>
      </div>
      {isConfirmModalVisible && (
        <ConfirmModal
          optionOneTxt="doch nicht"
          optionTwoTxt="do it"
          handleOptionOneClick={() => setIsConfirmModalVisible(false)}
          handleOptionTwoClick={() => {
            setIsConfirmModalVisible(false);
            confirmModalSuccessFunction();
          }}
        />
      )}
    </>
  );
};

export default CalendarTimeslotModal;
