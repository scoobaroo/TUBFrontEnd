import React, { createContext, useEffect, useState } from 'react';
import { withFirebase } from '../firebase';

const AppContext = createContext([{}, () => {}]);

const getThemeFromLocal = () => {
  let theme = null;
  if (window.localStorage) {
    theme = window.localStorage.getItem('unblockTheme');
  }
  return theme ? theme : 'dark';
}

const getScaleFromLocal = () => {
  let scale = null;
  if (window.localStorage) {
    scale = window.localStorage.getItem('unblockScale');
  }
  return scale ? scale : 'large';
}

const storeInitialState = {
  authUser: null,
  loading: false,
  loggedIn: false,
  theme: getThemeFromLocal(),
  scale: getScaleFromLocal(),
  accountId: null
};

const AppContextBase = props => {
  const [state, setState] = useState(storeInitialState);

  const { firebase } = props;

  useEffect(() => {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser ?
        setState(state => ({ ...state, authUser : authUser, loggedIn : true }))
        : setState(state => ({ ...state, authUser : null, loggedIn : false }));
    });
  }, [firebase.auth]);

  return (
    <AppContext.Provider value={[state, setState]}>
      {props.children}
    </AppContext.Provider>
  )
};

const AppContextProvider = withFirebase(AppContextBase);

export { AppContext, AppContextProvider };
