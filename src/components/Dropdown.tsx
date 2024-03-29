import '../style/dropdown.css';
import { useState, useRef } from 'react';
import OutsideClickHandler from './OutsideClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
  classList?: string | null;
  label?: string | null;
  placeholder: string;
  options: { value: string | number; label: string }[];
  selected: { value: string | number; label: string };
  setSelected: React.Dispatch<React.SetStateAction<Filter>>;
}

interface Filter {
  value: string | number;
  label: string;
}

const Dropdown = ({
  classList,
  label,
  placeholder,
  options,
  selected,
  setSelected,
}: DropdownProps) => {
  const [isActive, setIsActive] = useState(false);

  const refDropdown = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = () => {
    setIsActive(false);
  };

  const handleOptionClick = (value: Filter) => {
    setSelected(value);
    setIsActive(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <div className={'dropdown-menu ' + classList} ref={refDropdown}>
        {label && <div className="label">{label}</div>}
        <div
          onClick={() => setIsActive(!isActive)}
          className={isActive ? 'dropdown-button active' : 'dropdown-button'}
        >
          {selected.label || placeholder}
          <FontAwesomeIcon className="icon" icon={faChevronDown} />
          <div
            className={
              isActive ? 'dropdown-options active' : 'dropdown-options'
            }
          >
            {options.map((option) => (
              <div
                onClick={() => handleOptionClick(option)}
                className="dropdown-option"
                key={option.value}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
