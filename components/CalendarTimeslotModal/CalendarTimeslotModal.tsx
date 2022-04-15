import style from './CalendarTimeslotModal.module.css';
import Timeslot from '../../interfaces/Timeslot';
import dayjs from 'dayjs';

interface Props {
  timeslot: Timeslot | null;
  closeModal: () => void;
}

const CalendarTimeslotModal = ({ timeslot, closeModal }: Props) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const update = () => {
    if (!timeslot) return;

    // TODO: enhance timeslot modal to configure start, end, repeating
    // TODO: save timeslot to DB => trigger aws lambda after creation
    // TODO: write aws lambda to save timeslot in DB
    // TODO: get timeslots in getsersideprops

    timeslot.end = dayjs(timeslot.start).add(2, 'hour').format();
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
      </div>
    </div>
  );
};

export default CalendarTimeslotModal;
