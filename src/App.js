import React from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'regenerator-runtime/runtime';
import { AppContext, AppContextProvider } from './context';
import Firebase, { FirebaseContext } from './firebase';
import { MetaMaskProvider } from "metamask-react";
import Home from './containers/Home';
import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';
import Bounties from './containers/Bounties';
import PasswordReset from './containers/PasswordReset';
import NewBounty from './containers/NewBounty';
import NavBar from './components/NavBar';
import BountyDetails from './containers/BountyDetails';
import MyBounties from './containers/MyBounties';
import './clientlibs/css/App.css';

function Wrapper() {
  const [state] = React.useContext(AppContext);
  return (
    <Provider height="100vh" theme={defaultTheme} colorScheme={state.theme} scale={state.scale}>
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/new-bounty" element={<NewBounty />} />
          <Route path="/bountydetails" element={<BountyDetails />} />
          <Route path="/mybounties" element={<MyBounties />} />
        </Routes>
      </Router>
    </Provider>
  );
}

const App = () => {
  return (
    <FirebaseContext.Provider value={new Firebase()}>
      <AppContextProvider>
        <MetaMaskProvider>
          <Wrapper />
        </MetaMaskProvider>
      </AppContextProvider>
    </FirebaseContext.Provider>
  );
}

export default App;
