import React, { useContext, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AppStateContext } from '../../contexts/AppStateContext';
import { handleError, clearError } from '../HelperFunctions.js';
import Logo from '../generic/Logo';
import BackgroundImages from './BackgroundImages';
import PasswordShowHide from './PasswordShowHide';
import { ReactComponent as EmailIcon } from '../../assets/icons/email.svg';

let history = createBrowserHistory();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setToken } = useContext(AuthContext);
  const { loginUser } = useContext(AppStateContext);

  let DEBUG = false;

  let disabled = !password || !email || loading;

  if (DEBUG) console.log(setToken);

  function handleSubmit(event) {
    event.preventDefault();

    if (!disabled) {
      setLoading(true);
      loginUser({
        setToken,
        email,
        pw: password,
        successCallback: () => {
          setLoading(false);
          setEmail('');
          setPassword('');
        },
        errorCallback: (err) => {
          setLoading(false);
          clearError();
          handleError(err, setErrorMsg);
        },
      });
    }
  }

  history.replace('/login');

  return (
    <main className='formMain'>
      <BackgroundImages />
      <section className='loginContainer'>
        <div className='logoContainer'>
          <Logo />
        </div>
        <div className='loginFormBox'>
          <h2 className='formHeadline'>Login</h2>
          <div className='signUpText'>
            <p>Don't have an account?</p>
            <Link className='formLink' to='/register'>
              Sign Up Now
            </Link>
          </div>
          <div className='message'>
            <p className='errorMessage'>{errorMsg}</p>
            <p className='successMessage'>{successMsg}</p>
          </div>
          <form method='POST' onSubmit={handleSubmit}>
            <div className='inputBox'>
              <label className='formLabel' htmlFor='email'>
                <EmailIcon />
              </label>
              <input
                className='formInput'
                type='email'
                name='email'
                placeholder='email'
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <PasswordShowHide password={password} setPassword={setPassword} />
            <div>
              <button
                type='submit'
                className={disabled ? 'formButtonInactive' : 'formButton'}
                disabled={disabled}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
