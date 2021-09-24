import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ApiContext } from '../contexts/ApiContext';
import createHistory from 'history/createBrowserHistory';
import BackgroundImages from './BackgroundImages';
import Logo from './Logo';
import { ReactComponent as EmailIcon } from '../assets/icons/email.svg';
import { ReactComponent as UsernameIcon } from '../assets/icons/username.svg';
import { ReactComponent as PasswordIcon } from '../assets/icons/password.svg';
import { ReactComponent as PhoneIcon } from '../assets/icons/phone.svg';
import { ReactComponent as HidePasswordIcon } from '../assets/icons/hidepassword.svg';
import { ReactComponent as ShowPasswordIcon } from '../assets/icons/showpassword.svg';
import PasswordShowHide from './PasswordShowHide';

const styles = {
    main: {
        fontFamily: '"Poppins", sans-serif',
        background: '#B0F0EB',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    section: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: 'fit-content',
        height: '100vh',
        margin: '25px 100px',
    },
    formBox: {
        background: 'rgba(255,255,255,0.7)', 
        padding: '50px', 
        height: 'fit-content',
        borderRadius: '25px', 
        boxShadow: '7px 12px 24px -8px rgba(0,0,0,0.40)',
    }, 
    signUpText: {
        paddingTop: '20px',
        textAlign: 'center',
    },
    acceptedPasswordText: {
        paddingTop: '20px',
        // width: '350px',
        font: '400 14px / 1.2 Poppins, sans-serif',
        color: '#acacac',
        fontStyle: 'italic',
    },
    backButton: {
        height: 'fit-content',
        padding: '30px',
        cursor: 'pointer',
    },
}

const Register = () => {
    const [email, setEmail] = useState('');
    const [pwValues, setPwValues] = useState({
        pw: '',
        showPassword: false,
    });
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const { registerUser } = useContext(ApiContext);

    let DEBUG = true;

    function handleSubmit(event) {
        event.preventDefault();

        registerUser({
            email,
            username,
            phone,
            pw: pwValues.pw,
            successCallback: res => setSuccessMsg(res),
            successTimeout: () => (setTimeout(() => {
                setSuccessMsg('');
            }, 5000)),
            errorCallback: err => setErrorMsg(err),
            errorTimeout: () => (setTimeout(() => {
                setErrorMsg('');
            }, 5000))
        });
    }
    
    createHistory().replace('/register');

    return (
        <main>
        <BackgroundImages />
        <section className='container'>
            <div className='logoContainer'>
                <Logo />
            </div>
            <div className='formBox'>
                    <h2 className='formHeadline'>Register</h2>
                    <div className='loginText'>
                        <p>Already have an account?</p>
                        <Link className='formLink' to='/login'>Login Now</Link>
                    </div>
                    <div className='message'>
                      <p className='errorMessage'>{errorMsg}</p>
                      <p className='successMessage'>{successMsg}</p>
                    </div>
                    <form method='POST' 
                          onSubmit={handleSubmit}
                    >
                        <div className='inputBox'>
                            <label className='formLabel' for='email'>
                                <EmailIcon />
                            </label>
                            <input 
                                className='formInput' 
                                autoComplete='email' 
                                type='email' 
                                name='email' 
                                placeholder='email' 
                                required 
                                onChange={event => setEmail(event.target.value)}
                            />
                        </div>
                        <div className='inputBox'>
                            <label className='formLabel' for='username'>
                                <UsernameIcon />
                            </label>
                            <input 
                                className='formInput'
                                autoComplete='username' 
                                type='text' 
                                name='username' 
                                placeholder='username' 
                                required 
                                onChange={event => setUsername(event.target.value)}
                            />
                        </div>
                        <div className='inputBox'>
                           <label className='formLabel' for='phone'>
                               <PhoneIcon />
                            </label>
                           <input 
                                className='formInput'
                                autoComplete='phone' 
                                type='tel' 
                                name='phone' 
                                placeholder='phone' 
                                required 
                                onChange={event => setPhone(event.target.value)}
                            />
                        </div>
                        <div style={styles.acceptedPasswordText}>
                            At least 8 characters, 
                            must contain one upper-case letter, 
                            one lower-case letter, 
                            one digit and one special character
                        </div>
                        <PasswordShowHide pwValues={pwValues} setPwValues={setPwValues} />
                        <div>
                            <button className='formButton'>Register</button>
                        </div>
                    </form>
                </div>
        </section>      
    </main>
    );
}
 
export default Register;