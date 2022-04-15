import Appointment from '../../interfaces/Appointment';
import style from './CalendarAppointmentModal.module.css';

interface Props {
  appointment: Appointment | null;
  closeModal: () => void;
}

const CalendarAppointmentModal = ({ appointment, closeModal }: Props) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  if (!appointment) return null;

  return (
    <div className={style['calendar-modal']} onClick={handleOutsideClick}>
      <div className={style['modal-content']}>
        <h1>{appointment.heading}</h1>
        <p>{appointment.describtion}</p>
        <p>start: {appointment.start}</p>
        <p>end: {appointment.end}</p>
        <div onClick={closeModal} className={style['close']}>
          x
        </div>
      </div>
    </div>
  );
};

export default CalendarAppointmentModal;
