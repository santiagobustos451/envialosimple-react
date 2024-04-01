import { useState } from 'react';
import OutsideClickHandler from './OutsideClickHandler';
import Dropdown from './Dropdown';
import FilterCSS from '../../style/filters.module.css';

interface FilterDropdownProps {
  filterLabel: string;
  states: FilterSelector[];
  stateSetters: React.Dispatch<React.SetStateAction<Filter>>[];
}

interface FilterSelector {
  filter: Filter;
  options: Filter[];
}

interface Filter {
  value: string | number;
  label: string;
}

const FilterDropdown = ({
  filterLabel,
  stateSetters,
  states,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={FilterCSS.filterButton}
      >
        <div className={FilterCSS.label}>{filterLabel}</div>
        <div className={FilterCSS.currentStates}>
          {states.map((state) => (
            <div
              key={state.filter.label}
              className={FilterCSS.currentStateValue}
            >
              {state.filter.label}
            </div>
          ))}
        </div>
      </div>
      <div
        className={`${FilterCSS.filterOptions} ${isOpen && FilterCSS.active}`}
      >
        {states.map((state, index) => (
          <Dropdown
            key={state.filter.label}
            selected={state.filter}
            setSelected={stateSetters[index]}
            options={state.options}
          ></Dropdown>
        ))}
      </div>
    </OutsideClickHandler>
  );
};

export default FilterDropdown;
