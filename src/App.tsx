import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import createStore from 'react-auth-kit/createStore';
import Login from './pages/Login.tsx';
import GUI from './components/common/Nav.tsx';
import RouteError from './pages/RouteError.tsx';
import './index.css';
import './style/base.css';
import ListProducts from './pages/ListProducts.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={'/listProducts'} />,
    errorElement: <RouteError />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/listProducts',
    element: (
      <RequireAuth fallbackPath={'/login'}>
        <GUI>
          <ListProducts />
        </GUI>
      </RequireAuth>
    ),
  },
]);

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

function App() {
  return (
    <>
      <AuthProvider store={store}>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
