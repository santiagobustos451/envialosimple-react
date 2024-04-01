import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PaginatorCSS from '../../style/paginator.module.css';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Paginator = ({ currentPage, totalPages, setPage }: PaginatorProps) => {
  const [buttons, setButtons] = useState<string[]>([]);

  const generateButtons = () => {
    const result = [];

    let start, end;
    if (totalPages <= 7) {
      start = 1;
      end = totalPages;
    } else if (currentPage < 5) {
      start = 1;
      end = 5;
    } else if (currentPage > totalPages - 4) {
      start = totalPages - 4;
      end = totalPages;
    } else {
      start = currentPage - 1;
      end = currentPage + 1;
    }

    if (start > 1) {
      result.push('1', '...');
    }

    for (let i = start; i <= end; i++) {
      result.push(i.toString());
    }

    if (end < totalPages) {
      result.push('...', totalPages.toString());
    }

    return result;
  };

  useEffect(() => {
    setButtons(generateButtons());
  }, [totalPages, currentPage]);
  return (
    <>
      <div className={PaginatorCSS.paginatorContainer}>
        <button
          className={currentPage === 1 ? PaginatorCSS.disabled : ''}
          onClick={() => setPage(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
        </button>
        {buttons.map((button: string, index) => (
          <button
            key={button + index}
            onClick={() => setPage(Number(button))}
            className={
              Number(button) === currentPage
                ? PaginatorCSS.selected
                : '' + button === '...'
                ? PaginatorCSS.disabled
                : ''
            }
          >
            {button}
          </button>
        ))}
        <button
          className={currentPage === totalPages ? PaginatorCSS.disabled : ''}
          onClick={() => setPage(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
        </button>
      </div>
    </>
  );
};

export default Paginator;
