import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';

function SignOutButton() {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignout = () => {
    signOut();
    navigate('/login');
  };

  return <button onClick={() => handleSignout()}>Sign Out</button>;
}

export default SignOutButton;
