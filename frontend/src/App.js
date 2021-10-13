import { useContext, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './components/login-register/Register';
import Login from './components/login-register/Login';
import PetHome from './components/lost_and_found/PetHome';
import PetReport from './components/report_pet/PetReport';
import PetLandingPage from './components/landing_page/PetLandingPage';
import PetProfile from './components/lost_and_found/PetProfile';

function App() {
  const { token } = useContext(AuthContext);

  let isFooterBgTransparent = true;

  let DEBUG = false;

  if (DEBUG) console.log('App.js', token);


  if (!token) {
    return (
      <>
      <BrowserRouter>
        <Switch>
          <Route path='/login'>
            <Login />
            <Footer isFooterBgTransparent={isFooterBgTransparent}/>
          </Route>
          <Route path='/register'>
            <Register />
            <Footer isFooterBgTransparent={isFooterBgTransparent} />
          </Route>
          <Route path='/lostandfound'>
            <Navbar />
            <PetHome />
            <Footer />
          </Route>
          <Route path={'/petprofile/:id'}>
            <Navbar />
            <PetProfile />
            <Footer />
          </Route>
          <Route exact path='/'>
            <Navbar />
            <PetLandingPage />
            <Footer isFooterBgTransparent={isFooterBgTransparent} />
          </Route>
          <Route path='*'>
            <Navbar />
            <PetLandingPage />
            <Footer isFooterBgTransparent={isFooterBgTransparent} />
          </Route>
        </Switch>
      </BrowserRouter>
      </>
    );
  }

    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route path='/reportpet'>
              <Navbar />
              <PetReport />
              <Footer />
            </Route>
            <Route path='/lostandfound'>
              <Navbar />
              <PetHome />
              <Footer />
            </Route>
            <Route path={'/petprofile/:id'}>
              <Navbar />
              <PetProfile/>
              <Footer />
            </Route>
            <Route exact path='/'>
              <Navbar />
              <PetLandingPage />
              <Footer isFooterBgTransparent={isFooterBgTransparent} />
            </Route>
            <Route path='*'>
              <Navbar />
              <PetReport />
              <Footer />
            </Route>
          </Switch>
        </BrowserRouter>
      </>
    );
  }

export default App;
