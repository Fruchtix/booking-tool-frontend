import style from './CalendarTimeslotModal.module.css';
import Timeslot from '../../interfaces/Timeslot';

interface Props {
  timeslot: Timeslot | null;
  closeModal: () => void;
}

const CalendarTimeslotModal = ({ timeslot, closeModal }: Props) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  if (!timeslot) return null;

  return (
    <div className={style['calendar-modal']} onClick={handleOutsideClick}>
      <div className={style['modal-content']}>
        <p>start: {timeslot.start}</p>
        <p>end: {timeslot.end}</p>
        <div onClick={closeModal} className={style['close']}>
          x
        </div>
      </div>
    </div>
  );
};

export default CalendarTimeslotModal;
