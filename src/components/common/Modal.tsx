import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import ModalCSS from '../../style/modal.module.css';

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
      <div className={ModalCSS.modalContainer}>
        <div className={`${ModalCSS.modalWindow} ${isOpen && ModalCSS.active}`}>
          <div className={ModalCSS.modalHeader}>
            <div className={ModalCSS.title}>{title}</div>
            <button
              onClick={() => setIsOpen(false)}
              className={ModalCSS.closeButton}
            >
              <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
            </button>
          </div>

          {children}
        </div>
      </div>
      <div
        className={`${ModalCSS.overlay} ${isOpen && ModalCSS.active}`}
        onClick={() => setIsOpen(false)}
      ></div>
    </>,
    modalRoot
  );
};

export default Modal;
