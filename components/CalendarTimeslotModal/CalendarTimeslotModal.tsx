import style from './CalendarTimeslotModal.module.css';
import Timeslot from '../../interfaces/Timeslot';
import dayjs from 'dayjs';
import { useTimeslots } from '../../context/TimeslotContext';

interface Props {
  timeslot: Timeslot | null;
  closeModal: () => void;
}

const CalendarTimeslotModal = ({ timeslot, closeModal }: Props) => {
  const { timeslots, updateTimeslot } = useTimeslots();

  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;

    closeModal();
  };

  const update = () => {
    if (!timeslot) return;

    // TODO: enhance timeslot modal to configure start, end, repeating, option to delete it

    timeslot.end = dayjs(timeslot.start).add(2, 'hour').format();
  };

  const saveTimeslot = () => {
    if (!timeslot) return;

    updateTimeslot(timeslot);

    closeModal();
  };

  if (!timeslot) return null;

  return (
    <div className={style['calendar-modal']} onClick={handleOutsideClick}>
      <div className={style['modal-content']}>
        <p>start: {timeslot.start}</p>
        <p>end: {timeslot.end}</p>
        <div onClick={update}>*</div>
        <div onClick={closeModal} className={style['close']}>
          x
        </div>
        <button type="button" onClick={saveTimeslot}>
          save
        </button>
      </div>
    </div>
  );
};

export default CalendarTimeslotModal;
