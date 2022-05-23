import React from "react";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "regenerator-runtime/runtime";
import { AppContext, AppContextProvider } from "./context";
import Firebase, { FirebaseContext } from "./firebase";
import { MetaMaskProvider } from "metamask-react";
import SignUp from "./containers/SignUp";
import SignIn from "./containers/SignIn";
import Bounties from "./containers/Bounties";
import PasswordReset from "./containers/PasswordReset";
import NewBounty from "./containers/NewBounty";
import NavBar from "./components/NavBar";
import BountyDetails from "./containers/BountyDetails";
import MyCreatedBounties from "./containers/MyCreatedBounties";
import BountyImWorkedOn from "./containers/BountyImWorkedOn";
import UserProfile from "./containers/UserProfile";
import "./clientlibs/css/App.css";

function Wrapper() {
  const [state] = React.useContext(AppContext);

  return (
    <Provider
      minHeight="100vh"
      theme={defaultTheme}
      colorScheme={state.theme}
      scale={state.scale}
    >
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/new-bounty" element={<NewBounty />} />
          <Route path="/bountydetails" element={<BountyDetails />} />
          <Route path="/mybounties" element={<MyCreatedBounties />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/bountyworkedon" element={<BountyImWorkedOn />} />
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
};

export default App;
