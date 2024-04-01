import '../../style/dropdown.css';
import { useState, useRef, ReactNode } from 'react';
import OutsideClickHandler from './OutsideClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
  customButton?: ReactNode | null;
  customContent?: ReactNode | null;
  classList?: string | null;
  label?: string | null;
  placeholder?: string;
  options?: Filter[];
  selected?: Filter;
  setSelected?: React.Dispatch<React.SetStateAction<Filter>> | (() => void);
}

interface Filter {
  value: string | number;
  label: string;
}

const Dropdown = ({
  customButton,
  customContent,
  classList,
  label,
  placeholder = '',
  options = [] as Filter[],
  selected = { value: '', label: '' },
  setSelected = () => {},
}: DropdownProps) => {
  const [isActive, setIsActive] = useState(false);

  const refDropdown = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = () => {
    setIsActive(false);
  };

  const handleOptionClick = (value: Filter) => {
    setSelected && setSelected(value);
    setIsActive(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <div className={'dropdown-menu ' + classList} ref={refDropdown}>
        {label && <div className="label unselectable">{label}</div>}
        {customButton ? (
          <div onClick={() => setIsActive(!isActive)}>{customButton}</div>
        ) : (
          <div
            onClick={() => setIsActive(!isActive)}
            className={isActive ? 'dropdown-button active' : 'dropdown-button'}
          >
            {selected?.label || placeholder}
            <FontAwesomeIcon className="icon" icon={faChevronDown} />
          </div>
        )}

        <div
          className={isActive ? 'dropdown-options active' : 'dropdown-options'}
        >
          {customContent ? (
            <div className="custom">{customContent}</div>
          ) : (
            (options as Filter[]).map((option: Filter) => (
              <div
                onClick={() => handleOptionClick(option)}
                className="dropdown-option"
                key={option.value}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
