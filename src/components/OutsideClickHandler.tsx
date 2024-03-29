import { ReactNode, useEffect, useRef } from 'react';

interface OutsideClickHandlerProps {
  onOutsideClick: () => void;
  children: ReactNode;
}

const OutsideClickHandler = ({
  onOutsideClick,
  children,
}: OutsideClickHandlerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};

export default OutsideClickHandler;
