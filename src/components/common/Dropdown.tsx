import DropdownCSS from '../../style/dropdown.module.css';
import { useState, useRef, ReactNode } from 'react';
import OutsideClickHandler from './OutsideClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
  isShort?: boolean;
  isUp?: boolean;
  customButton?: ReactNode | null;
  customContent?: ReactNode | null;
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
  isUp,
  isShort,
  customButton,
  customContent,
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
      <div
        className={`${DropdownCSS.dropdownMenu} ${
          isShort && DropdownCSS.short
        } ${isUp && DropdownCSS.up}`}
        ref={refDropdown}
      >
        {label && (
          <div className={`${DropdownCSS.label} ${DropdownCSS.unselectable}`}>
            {label}
          </div>
        )}
        {customButton ? (
          <div onClick={() => setIsActive(!isActive)}>{customButton}</div>
        ) : (
          <div
            onClick={() => setIsActive(!isActive)}
            className={`${DropdownCSS.dropdownButton} ${
              isActive && DropdownCSS.active
            }`}
          >
            {selected?.label || placeholder}
            <FontAwesomeIcon
              className={DropdownCSS.icon}
              icon={faChevronDown}
            />
          </div>
        )}

        <div
          className={`${DropdownCSS.dropdownOptions} ${
            isActive && DropdownCSS.active
          }`}
        >
          {customContent ? (
            <div className={DropdownCSS.custom}>{customContent}</div>
          ) : (
            (options as Filter[]).map((option: Filter) => (
              <div
                onClick={() => handleOptionClick(option)}
                className={DropdownCSS.dropdownOption}
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
