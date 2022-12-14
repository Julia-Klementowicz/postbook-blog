// @ts-nocheck
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './app/hooks';
import { getUserStatus, loadUserFromCookie } from './redux/userSlice';
import {
  getLanguage,
  getLanguageStatus,
  loadLanguageFromCookie,
} from './redux/languageSlice';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { IntlProvider } from 'react-intl';
import English from './languages/en-US.json';
import Polish from './languages/pl-PL.json';

import { Helmet } from 'react-helmet-async';

import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import PageNotFound from './pages/PageNotFound';
import UserProfile from './pages/users/UserProfile';
import EditProfile from './pages/users/EditProfile';

import { CircularProgress } from '@mui/material';

const locale = navigator.language;

function App() {
  const dispatch = useAppDispatch();

  const userStatus = useSelector(getUserStatus);
  const currentLanguage = useSelector(getLanguage);
  const languageStatus = useSelector(getLanguageStatus);

  const [messages, setMessages] = useState(English);
  const [description, setDescription] = useState(
    'Stay in touch with your friends and family. Share your thoughts and precious moments in life.'
  );

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(loadUserFromCookie());
    }
    if (languageStatus === 'idle') {
      dispatch(loadLanguageFromCookie());
    }
  }, []);

  useEffect(() => {
    switch (currentLanguage) {
      case 'English':
        setMessages(English);
        setDescription(
          'Stay in touch with your friends and family. Share your thoughts and precious moments in life.'
        );
        break;
      case 'Polish':
        setMessages(Polish);
        setDescription(
          'Pozostań w kontakcie z przyjaciółmi i rodziną. Udostępniaj swoje przemyślenia oraz cenne momenty z życia.'
        );
        break;
      // add any new language cases here
      default:
        setMessages(English);
        setDescription(
          'Stay in touch with your friends and family. Share your thoughts and precious moments in life.'
        );
        break;
    }
  }, [currentLanguage]);

  return (
    <>
      <Helmet>
        <meta name='description' content={description} />
      </Helmet>
      <IntlProvider locale={locale} messages={messages}>
        {userStatus === 'succeeded' ? (
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='profile/:username' element={<UserProfile />} />
                <Route path='editprofile' element={<EditProfile />} />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        ) : (
          <div className='fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center'>
            <CircularProgress size='4rem' />
          </div>
        )}
      </IntlProvider>
    </>
  );
}

export default App;
