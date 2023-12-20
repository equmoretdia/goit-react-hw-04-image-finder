import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onClose, pictureURL }) {
  const handleOverlayClick = e => {
    console.log('e.target =>', e.target); //where the click actually happen
    console.log('e.currentTarget =>', e.currentTarget); //where it bubbled
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    console.log(
      'Modal useEffect addEventListener for handleKeyDown (componentDidMount analogue)'
    );
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      console.log(
        'Modal useEffect removeEventListener for handleKeyDown (componentWillUnmount analogue)'
      );
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal}>
        <img src={pictureURL} alt="" loading="lazy" />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  pictureURL: PropTypes.string.isRequired,
};
