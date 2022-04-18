import { useState } from 'react';
import style from './CalendarTimeslotModal.module.css';
import Timeslot from '../../interfaces/Timeslot';
import dayjs from 'dayjs';
import { useTimeslots } from '../../context/TimeslotContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

interface Props {
  timeslot: Timeslot;
  closeModal: () => void;
  isNew: boolean;
}

const CalendarTimeslotModal = ({ timeslot, closeModal, isNew }: Props) => {
  const { updateTimeslot, deleteTimeslot } = useTimeslots();
  const [hasChanged, setHasChanged] = useState(false);
  const [currentTimeslot, setCurrentTimeslot] = useState<Timeslot>(timeslot);
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmModalSuccessFunction, setConfirmModalSuccessFunction] = useState<() => void>(() => {});

  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;

    closeModal();
  };

  const update = () => {
    // TODO: enhance timeslot modal to configure start, end, repeating

    const updatedTimeslot = { ...currentTimeslot };

    updatedTimeslot.end = dayjs(updatedTimeslot.end).add(2, 'hour').format();

    setHasChanged(true);
    setCurrentTimeslot(updatedTimeslot);
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
    setConfirmModalSuccessFunction(() => deleteCurrentTimeslot);
    setIsConfirmModalVisible(true);
  };

  return (
    <>
      <div className={style['calendar-modal']} onClick={handleOutsideClick}>
        <div className={style['modal-content']}>
          <p>start: {currentTimeslot.start}</p>
          <p>end: {currentTimeslot.end}</p>
          <div onClick={update}>*</div>
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
