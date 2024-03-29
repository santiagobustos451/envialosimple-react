import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import createStore from 'react-auth-kit/createStore';
import Login from './pages/Login.tsx';
import AddProduct from './components/AddProduct.tsx';
import RouteError from './pages/RouteError.tsx';
import './index.css';
import ListProducts from './components/ListProducts.tsx';

const router = createBrowserRouter([
  {
    path: '/',
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
        <ListProducts />
      </RequireAuth>
    ),
    children: [
      {
        path: 'addProduct',
        element: <AddProduct />,
      },
    ],
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