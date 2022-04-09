import React from 'react';
import { Pivot as Hamburger } from 'hamburger-react';
import styled from 'styled-components';
import { ActionButton } from '@adobe/react-spectrum';
import withAuthorization from '../../session/withAuthorization';
import { withFirebase } from '../../firebase';
import { compose } from 'recompose';
import withRouter from '../../session/withRouter';

const NavBarWrapper = styled.nav`
  box-shadow: 0px 1px 8px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const NavMenuWrapper = styled.div`
`;

const NavMenu = ({ isLoggedIn }) => {
  return (
    <NavMenuWrapper>
        {isLoggedIn ? 'logged in' : 'not logged in'}
    </NavMenuWrapper>
  )
}

const NavControls = styled.div`
  display: flex;
  justify-content: space-between;
  ._btn {
    display: flex;
    align-items: center;
  }
  ._btn-sign-up {
    display: flex;
    align-items: center;
  }
  ._btn-authed {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-columns-gap: 8px;
    grid-row-gap: 8px;
    align-content: center;

  }
`
const AuthedNavWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 8px;
`;

const HamburgerButton = ({ open, setOpen }) => (
  <Hamburger toggled={open} toggle={setOpen} />
);

const AuthedNav = ({ navigate, currentUser, firebase }) => {
  console.log('currentUser', currentUser.uid);
  const handleSignOut = () => firebase.signOut();
  const handleNewBounty = () => navigate('/new-bounty');

  return (
    <AuthedNavWrapper>
      <div className='_btn-authed'>
        <ActionButton isQuiet onPress={handleNewBounty}>
          New Bounty
        </ActionButton>
      </div>
      <div className='_btn-authed'>
        <ActionButton isQuiet onPress={handleSignOut}>
          Sign Out
        </ActionButton>
      </div>
    </AuthedNavWrapper>
  );
}

const NonAuthedNav = ({ navigate }) => {
  const goToSignInPage = () => navigate('/sign-in');
  const goToSignUpPage = () => navigate('/sign-up');

  return (
    <div className='_btn'>
      <ActionButton isQuiet onPress={goToSignUpPage}>
          Sign-up
      </ActionButton>
    </div>
  )
}

const NavBarBase = ({ firebase, navigate }) => {
  const [open, setOpen] = React.useState(false);
  const currentUser = firebase.auth?.currentUser;
  const isLoggedIn = !!currentUser;
  return (
    <>
      <NavBarWrapper>
        <NavControls>
          <div>
            <HamburgerButton open={open} setOpen={setOpen} />
          </div>
          {currentUser ? <AuthedNav navigate={navigate} firebase={firebase} currentUser={currentUser} /> : <NonAuthedNav navigate={navigate} />}
        </NavControls>
        {open && (
          <NavMenu isLoggedIn={isLoggedIn} />
        )}
      </NavBarWrapper>
    </>
  );
}

const NavBar = compose(withRouter, withFirebase)(NavBarBase);

export default NavBar;
