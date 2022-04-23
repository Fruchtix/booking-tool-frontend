import React, { useState } from 'react';
import style from './CalendarTimeslotModal.module.css';
import Timeslot from '../../interfaces/Timeslot';
import dayjs, { Dayjs } from 'dayjs';
import { useTimeslots } from '../../context/TimeslotContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  timeslot: Timeslot;
  closeModal: () => void;
  isNew: boolean;
  currentWeekDays: any[];
}

const CalendarTimeslotModal = ({ timeslot, closeModal, isNew, currentWeekDays }: Props) => {
  const { updateTimeslot, deleteTimeslot, deleteTimeslotSeries } = useTimeslots();
  const [hasChanged, setHasChanged] = useState(false);
  const [shouldUpdateSeries, setShouldUpdateSeries] = useState(true);
  const [shouldDeleteSeriesBeforeUpdate, setShouldDeleteSeriesBeforeUpdate] = useState(false);
  const [currentTimeslot, setCurrentTimeslot] = useState<Timeslot>(timeslot);
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmModalButtonOneLabel, setConfirmModalButtonOneLabel] = useState('');
  const [confirmModalButtonTwoLabel, setConfirmModalButtonTwoLabel] = useState('');
  const [confirmModalSuccessFunction, setConfirmModalSuccessFunction] = useState<() => void>(() => {});
  const [shouldRepeat, setShouldRepeat] = useState(timeslot.repeats ?? false);
  const [repeatingDays, setRepeatingDays] = useState<Array<number>>(
    timeslot.repeatingDays ?? [Number(dayjs(currentTimeslot.start).weekday())]
  );
  const [repeatingUntilDate, setRepeatingUntilDate] = useState<string>(
    timeslot.repeatingEnd ?? dayjs(currentTimeslot.end).add(1, 'day').format('YYYY-MM-DD')
  );

  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;

    handleCloseModal();
  };

  const saveTimeslot = async () => {
    if (hasChanged || isNew) {
      setIsLoading(true);
      setDisplayError(false);

      try {
        let timeSlotToUpdate = currentTimeslot;

        if (shouldRepeat && repeatingDays.length !== 0) {
          timeSlotToUpdate = {
            ...timeSlotToUpdate,
            repeats: true,
            repeatingDays: repeatingDays.sort(),
            repeatingEnd: dayjs(repeatingUntilDate).hour(23).minute(59).format(),
            seriesID:
              shouldDeleteSeriesBeforeUpdate || !timeSlotToUpdate.seriesID ? uuidv4() : timeSlotToUpdate.seriesID,
          };
        }

        if (currentTimeslot.seriesID && shouldDeleteSeriesBeforeUpdate) {
          console.log('delete before');

          await Promise.all([
            deleteTimeslotSeries(currentTimeslot),
            updateTimeslot(timeSlotToUpdate, shouldUpdateSeries),
          ]);
        } else {
          console.log('do not delete');
          await updateTimeslot(timeSlotToUpdate, shouldUpdateSeries);
        }

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
      if (shouldUpdateSeries && timeslot.repeats) {
        await deleteTimeslotSeries(currentTimeslot);
      } else {
        await deleteTimeslot(currentTimeslot);
      }

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
    setConfirmModalButtonOneLabel('cancel');
    setConfirmModalButtonTwoLabel('do it');
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

      setShouldDeleteSeriesBeforeUpdate(true);

      return newRepeatingDays;
    });

    setHasChanged(true);
  };

  const handleRepeatingChange = () => {
    setShouldRepeat(shouldRepeat => !shouldRepeat);

    setHasChanged(true);
  };

  const handleCloseModal = () => {
    if (hasChanged) {
      setConfirmModalSuccessFunction(() => closeModal);
      setConfirmModalButtonOneLabel('cancel');
      setConfirmModalButtonTwoLabel('do it');
      setIsConfirmModalVisible(true);
    } else {
      closeModal();
    }
  };

  const handleRepeatingUntilDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = dayjs(e.currentTarget.value, 'YYYY-MM-DD').format();

    setRepeatingUntilDate(formattedDate);
    setHasChanged(true);
    setShouldDeleteSeriesBeforeUpdate(true);
  };

  const handleShouldUpdateSeriesChange = () => {
    setShouldUpdateSeries(value => !value);
  };

  return (
    <>
      <div className={style['calendar-modal']} onClick={handleOutsideClick}>
        <div className={style['modal-content']}>
          {shouldRepeat && !isNew && (
            <div>
              <select
                value={shouldUpdateSeries ? 'series' : 'occurrence'}
                name="target"
                id="target"
                onChange={handleShouldUpdateSeriesChange}
              >
                <option value="occurrence">Edit only this occurrence</option>
                <option value="series">Edit whole series</option>
              </select>
            </div>
          )}

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
            {/* TODO: allow changes to time series in the past when you change further event => introduct start date and set this as start*/}
            {/* TODO: add start date to timeslot series */}
            {/* TODO: end time can't be ealier than start */}
            {/* TODO: when creating free timeslot check if other timeslot is during that time */}
            {/* TODO: initial loading => display loading state */}
            {shouldUpdateSeries && (
              <>
                <label htmlFor="repeating">repeats:</label>
                <select
                  value={shouldRepeat ? 'weekly' : 'noRepeat'}
                  name="repeating"
                  id="repeating"
                  onChange={handleRepeatingChange}
                >
                  <option value="noRepeat" disabled={shouldRepeat && !isNew}>
                    Does not repeat
                  </option>
                  <option value="weekly">weekly</option>
                </select>
              </>
            )}

            {shouldRepeat && shouldUpdateSeries && (
              <>
                <div className={style['repeating-days-wrapper']}>
                  <label htmlFor="days">On</label>
                  <div className={style['days']} id="days">
                    {currentWeekDays.map((day: Dayjs) => {
                      const dayInWeek = day.weekday();
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
                <div className={style['until']}>
                  <label htmlFor="until-date">Until:</label>
                  <input
                    type="date"
                    name="until-date"
                    id="until-date"
                    min={dayjs(currentTimeslot.end).add(1, 'day').format('YYYY-MM-DD')}
                    value={dayjs(repeatingUntilDate).format('YYYY-MM-DD')}
                    onChange={handleRepeatingUntilDateChange}
                  />
                </div>
              </>
            )}
          </div>
          <div onClick={handleCloseModal} className={style['close']}>
            x
          </div>
          {displayError && <div>Sorry an error ahas occured, please submit again...</div>}
          <div>
            <button type="button" onClick={saveTimeslot} disabled={repeatingDays.length === 0}>
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
          optionOneTxt={confirmModalButtonOneLabel}
          optionTwoTxt={confirmModalButtonTwoLabel}
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
