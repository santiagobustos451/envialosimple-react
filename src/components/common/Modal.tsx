import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import '../../style/modal.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

const Modal = ({ children, title, isOpen, setIsOpen }: ModalProps) => {
  const modalRoot = document.getElementById('overlays') as Element;

  return createPortal(
    <>
      <div className="modal-container">
        <div className={isOpen ? 'modal-window active' : 'modal-window'}>
          <div className="modal-header">
            <div className="title">{title}</div>
            <button onClick={() => setIsOpen(false)} className="close-button">
              <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
            </button>
          </div>

          {children}
        </div>
      </div>
      <div
        className={isOpen ? 'overlay active' : 'overlay'}
        onClick={() => setIsOpen(false)}
      ></div>
    </>,
    modalRoot
  );
};

export default Modal;
