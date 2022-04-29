import React from 'react';
import { AppContext } from '../context';

export default function useAccountId() {
  const [state, setState] = React.useContext(AppContext);

  const setAccountId = (id) => {
    setState((prevState) => ({
      ...prevState,
      accountId: id
    }));

    if (window.localStorage) {
      window.localStorage.setItem('accountId', id);
    }
  }

  return {
    setAccountId
  }
}
