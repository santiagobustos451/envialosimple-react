import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

function SignOutButton() {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <button onClick={() => handleSignout()}>
      <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon> Sign Out
    </button>
  );
}

export default SignOutButton;
