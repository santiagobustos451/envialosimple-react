import { ReactNode, useState } from 'react';
import NavCSS from '../../style/nav.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Isotype from '../svg/Isotype';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import SignOutButton from '../auth/SignOutButton';
import OutsideClickHandler from './OutsideClickHandler';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface NavProps {
  children: ReactNode;
}

interface UserData {
  name: string;
  token: string;
}

const Nav = ({ children }: NavProps) => {
  const [navOpen, setNavOpen] = useState(false);

  const auth = useAuthUser<UserData>();
  const username = auth?.name || '';
  return (
    <div className={NavCSS.nav}>
      <div onClick={() => setNavOpen(!navOpen)} className={NavCSS.navToggle}>
        <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
      </div>
      <OutsideClickHandler onOutsideClick={() => setNavOpen(false)}>
        <div className={`${NavCSS.navBar} ${navOpen && NavCSS.active}`}>
          <div className={NavCSS.isotype}>
            <Isotype></Isotype>
          </div>
          <div className={NavCSS.userOptions}>
            <div className={NavCSS.message}>
              You are logged in as {username}
            </div>
            <SignOutButton></SignOutButton>
          </div>
        </div>
      </OutsideClickHandler>
      <div className={NavCSS.content}>{children}</div>
    </div>
  );
};

export default Nav;
