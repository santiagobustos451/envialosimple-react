import { Link } from 'react-router-dom';

function RouteError() {
  return (
    <>
      <p>Error: Page not found</p>
      <Link to={'/login'}>Back to Home</Link>
    </>
  );
}

export default RouteError;
