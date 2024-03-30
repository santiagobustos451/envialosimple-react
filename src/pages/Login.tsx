import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  const [passwordVisible, setPasswordVisible] = useState(false);

  const signIn = useSignIn();
  const navigate = useNavigate();

  const apiUrl = '/api/auth/login';

  /* Form Submit handler */
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

  /* JSX Render */
  return (
    <>
      <div className="login-container">
        <div className="login-window">
          <div className="info">
            Welcome to <div className="title">Product List</div>
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <input
                className="form-field"
                {...register('username')}
                type="text"
                placeholder="Username"
              />
              {errors.username && (
                <div className="form-error">{errors.username.message}</div>
              )}
              <div className="password-field form-field">
                <input
                  className="form-field"
                  {...register('password')}
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                />
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="show-password"
                >
                  {passwordVisible ? (
                    <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                  )}
                </div>
                {errors.password && (
                  <div className="form-error">{errors.password.message}</div>
                )}
              </div>
              {errors.root && (
                <div className="form-error">{errors.root.message}</div>
              )}
              <div className="form-footer">
                <button disabled={isSubmitting} type="submit">
                  {isSubmitting ? 'Loading...' : 'Log In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
