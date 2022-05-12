import React from "react";
import { Pivot as Hamburger } from "hamburger-react";
import styled from "styled-components";
import { ActionButton, Switch } from "@adobe/react-spectrum";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import useUIControls from "../../hooks/useUIControls";
import { AppContext } from "../../context";
import { GiSunrise, GiSunset, GiResize, } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";

const NavBarWrapper = styled.nav`
  box-shadow: 0px 1px 8px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;
const ThemeButtonContainer = styled.div``;
const NavMenuWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NavMenu = ({ isLoggedIn }) => {
  return (
    <NavMenuWrapper>
      {isLoggedIn ? "logged in" : "not logged in"}
    </NavMenuWrapper>
  );
};
const Flexer = styled.div`
  display: flex;
`;

const NavControls = styled.div`
  display: flex;
  margin: 0 16px;
  justify-content: space-between;
  align-items: center;

  ._btn {
    display: flex;
    align-items: center;
  }
  ._btn-sign-up {
    display: flex;
    align-items: center;
  }
  ._btn-authed {
    display: flex;
    align-items: center;
    color: #8a7e7e;
  }
  ._userAvatar {
    dipslay: flex;
    justify-content: flex-end;
  }
`;
const AuthedNavWrapper = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
`;

const HamburgerButton = ({ open, setOpen }) => (
  <Hamburger toggled={open} toggle={setOpen} />
);

const AuthedNav = ({ navigate, currentUser, firebase }) => {
  // console.log('currentUser', currentUser.uid);
  const [state] = React.useContext(AppContext);
  const { toggleMode } = useUIControls();
  const handleSignOut = () => firebase.signOut();
  const handleNewBounty = () => navigate("/new-bounty");
  const handleMyBounty = () => navigate("/mybounties");
  const BountyHandler = () => navigate("/bounties");
  console.log("state =>", state);

  return (
    <AuthedNavWrapper>
      <div className="_btn-authed">
        <ActionButton isQuiet onPress={handleMyBounty}>
          MyBounties
        </ActionButton>
      </div>
      {state.mode === "customer" ? (
        <div className="_btn-authed">
          <ActionButton isQuiet onPress={handleNewBounty}>
            Create New Bounty
          </ActionButton>
        </div>
      ) : null}
      {state.mode === "provider" ? (
        <div className="_btn-authed">
          <ActionButton isQuiet onPress={BountyHandler}>
            Bounties
          </ActionButton>
        </div>
      ) : null}      
      <div className="_btn-authed">
        <ActionButton isQuiet onPress={handleSignOut}>
          Sign Out
        </ActionButton>
      </div>
      <div className="_btn-authed">
        <Switch onChange={toggleMode} />
        {state.mode}
      </div>
    </AuthedNavWrapper>
  );
};

const NonAuthedNav = ({ navigate }) => {
  const goToSignInPage = () => navigate("/sign-in");
  const goToSignUpPage = () => navigate("/sign-up");

  return (
    <Flexer>
      <div className="_btn">
        <ActionButton isQuiet onPress={goToSignUpPage}>
          Sign-up
        </ActionButton>
      </div>
      <div className="_btn">
        <ActionButton isQuiet onPress={goToSignInPage}>
          Sign-in
        </ActionButton>
      </div>
    </Flexer>
  );
};

const NavBarBase = ({ firebase, navigate }) => {
  const [state] = React.useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const { toggleTheme, reSize } = useUIControls();
  const currentUser = firebase.auth?.currentUser;
  const isLoggedIn = !!currentUser;
  const { theme } = state;
  const userProfileHandler = () => navigate("/userprofile");
  return (
    <>
      <NavBarWrapper>
        <NavControls>
          <NavMenuWrapper>
            <div>
              <HamburgerButton open={open} setOpen={setOpen} />
            </div>
            <div>
              {currentUser ? (
                <AuthedNav
                  navigate={navigate}
                  firebase={firebase}
                  currentUser={currentUser}
                />
              ) : (
                <NonAuthedNav navigate={navigate} />
              )}
            </div>
          </NavMenuWrapper>
          <ThemeButtonContainer>
            <ActionButton onPress={reSize} isQuiet>
              <GiResize />
            </ActionButton>
            <ActionButton onPress={toggleTheme} isQuiet>
              {theme === "light" ? <GiSunset /> : <GiSunrise />}
            </ActionButton>
            <ActionButton onPress={userProfileHandler} isQuiet>
              <FaUserAlt />
            </ActionButton>
          </ThemeButtonContainer>
        </NavControls>
        {open && <NavMenu isLoggedIn={isLoggedIn} />}
      </NavBarWrapper>
    </>
  );
};

const NavBar = compose(withRouter, withFirebase)(NavBarBase);

export default NavBar;
