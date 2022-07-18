import React, { createContext, useEffect, useState } from "react";
import { withFirebase } from "../firebase";

const AppContext = createContext([{}, () => {}]);

const getThemeFromLocal = () => {
  let theme = null;
  if (window.localStorage) {
    theme = window.localStorage.getItem("unblockTheme");
  }
  return theme ? theme : "dark";
};

const getModeFromLocal = () => {
  let mode = null;
  if (window.localStorage) {
    mode = window.localStorage.getItem("unblockMode");
  }

  return mode ? mode : "customer";
};

const getScaleFromLocal = () => {
  let scale = null;
  if (window.localStorage) {
    scale = window.localStorage.getItem("unblockScale");
  }
  return scale ? scale : "large";
};

const getAccountId = () => {
  let accountId;
  if (window.localStorage) {
    accountId = window.localStorage.getItem("accountId");
  }
  return accountId ? accountId : null;
};

const getCategorys = () => {
  let categorys;
  let NewCategorys;
  if (window.localStorage) {
    categorys = window.localStorage.getItem("categorys");
    NewCategorys = JSON.parse(categorys);
  }
  return NewCategorys ? NewCategorys : null;
};

const getEducationType = () => {
  let educationType;
  let NewEducationType;
  if (window.localStorage) {
    educationType = window.localStorage.getItem("educationType");
    NewEducationType = JSON.parse(educationType);
  }
  return NewEducationType ? NewEducationType : null;
};

const getRequestWork = () => {
  let requestWork;
  let NewRequestWork;
  if (window.localStorage) {
    requestWork = window.localStorage.getItem("requestWork");
    NewRequestWork = JSON.parse(requestWork);
  }
  return NewRequestWork ? NewRequestWork : null;
};

const erc20chains = () => {
  let erc20chains;
  let NewERC20Chains;
  if (window.localStorage) {
    erc20chains = window.localStorage.getItem("erc20chains");
    NewERC20Chains = JSON.parse(erc20chains);
  }
  return NewERC20Chains ? NewERC20Chains : null;
};

const getCeritficationType = () => {
  let ceritficationType;
  let NewCeritficationType;
  if (window.localStorage) {
    ceritficationType = window.localStorage.getItem("certificaitonType");
    NewCeritficationType = JSON.parse(ceritficationType);
  }
  return NewCeritficationType ? NewCeritficationType : null;
};

const storeInitialState = {
  authUser: null,
  loading: false,
  loggedIn: false,
  theme: getThemeFromLocal(),
  scale: getScaleFromLocal(),
  mode: getModeFromLocal(),
  accountId: getAccountId(),
  categorys: getCategorys(),
  EducationType: getEducationType(),
  CertificationType: getCeritficationType(),
  RequestWork: getRequestWork(),
  Erc20Chains: erc20chains(),
  MessageContext: "",
};

const AppContextBase = (props) => {
  const [state, setState] = useState(storeInitialState);

  const { firebase } = props;

  useEffect(() => {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser
        ? setState((state) => ({
            ...state,
            authUser: authUser,
            loggedIn: true,
          }))
        : setState((state) => ({ ...state, authUser: null, loggedIn: false }));
    });
  }, [firebase.auth]);

  return (
    <AppContext.Provider value={[state, setState]}>
      {props.children}
    </AppContext.Provider>
  );
};

const AppContextProvider = withFirebase(AppContextBase);

export { AppContext, AppContextProvider };
