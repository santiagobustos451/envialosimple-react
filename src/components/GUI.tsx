import { ReactNode, useState } from 'react';
import '../style/gui.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import SignOutButton from './SignOutButton';
import OutsideClickHandler from './OutsideClickHandler';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface GUIProps {
  children: ReactNode;
}

interface UserData {
  name: string;
  token: string;
}

const GUI = ({ children }: GUIProps) => {
  const [navOpen, setNavOpen] = useState(false);

  const auth = useAuthUser<UserData>();
  const username = auth?.name || '';
  return (
    <div className="gui">
      <div onClick={() => setNavOpen(!navOpen)} className="nav-toggle">
        <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
      </div>
      <OutsideClickHandler onOutsideClick={() => setNavOpen(false)}>
        <div className={navOpen ? 'nav-bar active' : 'nav-bar'}>
          <div className="logo">
            <FontAwesomeIcon icon={faProductHunt}></FontAwesomeIcon>
          </div>
          <div className="user-options">
            <div className="message">You are logged in as {username}</div>
            <SignOutButton></SignOutButton>
          </div>
        </div>
      </OutsideClickHandler>
      <div className="content">{children}</div>
    </div>
  );
};

export default GUI;
