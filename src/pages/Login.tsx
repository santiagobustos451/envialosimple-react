import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import LoginCSS from '../style/login.module.css';
import FormCSS from '../style/form.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Logotype from '../components/svg/Logotype';

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
          } else {
            setError('root', {
              message: 'Something went wrong - Try again later',
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
      <div className={LoginCSS.loginContainer}>
        <div className={LoginCSS.loginWindow}>
          <div className={LoginCSS.info}>
            Welcome to <div className={LoginCSS.title}>Product List</div>
          </div>
          <div className={LoginCSS.loginForm}>
            <div className={LoginCSS.logo}>
              <Logotype></Logotype>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <div className={FormCSS.formField}>
                <input
                  className={FormCSS.formField}
                  {...register('username', {
                    required: 'This field is required',
                  })}
                  type="text"
                  placeholder="Username"
                />
                {errors.username && (
                  <div className={FormCSS.formError}>
                    {errors.username.message}
                  </div>
                )}
              </div>
              <div className={`${LoginCSS.passwordField} ${FormCSS.formField}`}>
                <input
                  className=""
                  {...register('password', {
                    required: 'This field is required',
                  })}
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                />
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className={LoginCSS.showPassword}
                >
                  {passwordVisible ? (
                    <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                  )}
                </div>
                {errors.password && (
                  <div className={FormCSS.formError}>
                    {errors.password.message}
                  </div>
                )}
              </div>
              {errors.root && (
                <div className={FormCSS.formError}>{errors.root.message}</div>
              )}
              <div className={LoginCSS.formFooter}>
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
