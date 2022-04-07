import React, { createContext, useEffect, useState } from 'react';
import { withFirebase } from '../firebase';

const AppContext = createContext([{}, () => {}]);

const storeInitialState = {
  authUser: null,
  loading: false,
  loggedIn: false,
  theme: 'light',
  scale: 'large',
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
