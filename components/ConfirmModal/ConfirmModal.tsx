import style from './ConfirmModal.module.css';

interface Props {
  optionOneTxt: string;
  optionTwoTxt: string;
  handleOptionOneClick: () => void;
  handleOptionTwoClick: () => void;
}

const ConfirmModal = ({ optionOneTxt, optionTwoTxt, handleOptionOneClick, handleOptionTwoClick }: Props) => {
  return (
    <div className={style['modal']}>
      <div className={style['modal-content']}>
        <h1>confirm modal</h1>
        <p>Are you sure?</p>
        <button type="button" onClick={handleOptionOneClick}>
          {optionOneTxt}
        </button>
        <button type="button" onClick={handleOptionTwoClick}>
          {optionTwoTxt}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
