import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';

type FormFields = {
  username: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormFields>();

  const signIn = useSignIn();
  const navigate = useNavigate();

  const apiUrl = '/api/auth/login';

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 422) {
            setError('root', {
              message: 'Invalid Credentials',
            });
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        signIn({
          auth: {
            token: responseData.token,
            type: 'Bearer',
          },
          userState: {
            name: data.username,
            token: responseData.token,
          },
        });
        navigate('/listProducts');
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <div className="login-container">
        <div className="login-window">
          <form onSubmit={handleSubmit(onSubmit)} action="">
            <input
              {...register('username')}
              type="text"
              placeholder="Username"
            />
            {errors.username && (
              <div className="form-error">{errors.username.message}</div>
            )}
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <div className="form-error">{errors.password.message}</div>
            )}
            {errors.root && (
              <div className="form-error">{errors.root.message}</div>
            )}
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Loading...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
