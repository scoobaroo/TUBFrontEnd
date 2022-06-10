import React from "react";
import { Pivot as Hamburger } from "hamburger-react";
import styled from "styled-components";
import {
  ActionButton,
  Switch,
  Button,
  MenuTrigger,
  Menu,
  Item,
  SearchField,
  ComboBox,
} from "@adobe/react-spectrum";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import useUIControls from "../../hooks/useUIControls";
import useAccountId from "../../hooks/useAccountId";
import { AppContext } from "../../context";
import { GiSunrise, GiSunset, GiResize } from "react-icons/gi";
import appConfig from "webpack-config-loader!../../app-config.js";
import {
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineSearch,
} from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import ImageIcon from "../ImageIcon";
import Connection from "../ChainConnection/index";

const NavBarWrapper = styled.nav`
  box-shadow: 0px 1px 8px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 7px 0;
`;
const ThemeButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const NavMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  & .create-new-bounty-mobile {
    display: none;
    @media (max-width: 576px) {
      display: block;
      margin: 6px;
    }
  }

  & ._btn_diplay {
    @media (min-width: 1200px) {
      display: none;
    }
  }
  @media (max-width: 1200px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Flexer = styled.div`
  display: flex;
  @media (max-width: 1200px) {
    display: none;
  }
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

const SerachWrapper = styled.div`
  display: flex;
  @media (max-width: 992px) {
    display: none;
  }
`;
const SerachWrapperMobile = styled.div`
  display: none;
  @media (max-width: 992px) {
    display: flex;
    width: 100%;
    padding: 10px 22px 0 22px;
  }
`;
const SearchFilter = styled.div`
  & div {
    min-width: auto;
    width: 120px;

    @media (max-width: 768px) {
      border-radius: 25px 0 0 25px;
      min-width: 8px;
    }
  }
  & input {
    border-radius: 25px 0 0 25px;
  }
  & button {
    border-left: none;
    border-radius: 0;
    background: #080808;
    width: 25px !important;
  }
`;
const SearchButton = styled.div`
  & button {
    border-radius: 0 25px 25px 0;
    min-width: auto;
    padding: 0 10px 0 8px;
  }
`;
const SearchInput = styled.div`
  @media (max-width: 992px) {
    width: 100%;
  }
  & div {
    min-width: auto;
    width: 190px;
    & div {
      width: 20px;
      & svg {
        display: block;
      }
    }
    @media (max-width: 992px) {
      width: 100%;
    }
  }
  & input {
    padding: 7px 10px !important;
    border-left: none;
    border-radius: 0;
  }
  & svg {
    display: none;
  }
`;

const AuthedNavWrapper = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const CreateNewBounty = styled.div`
  & button {
    background: #6b6b6b;
    border-radius: 30px;
    color: #fff;
    cursor: pointer;
  }
  @media (max-width: 576px) {
    display: none;
  }
`;
const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ffffff;
  overflow: hidden;
`;

const ConnectedButton = styled.button`
  border: none;
  background: none;
  padding: 0 17px;
  margin-right: 10px;
  line-height: 40px;
  border-radius: 30px;
  cursor: pointer;
  @media (max-width: 992px) {
    line-height: 20px;
  }
  @media (max-width: 576px) {
    padding: 0 7px;
    margin-right: 0;
    line-height: 20px;
  }
  &:hover {
    background: #333333;
  }
  & button {
    line-height: 40px;
    background: none;
    box-shadow: none;
    border: none;
    @media (max-width: 992px) {
      line-height: 20px;
    }
    @media (max-width: 576px) {
      line-height: 18px;
    }
  }
`;

const HamburgerWrapper = styled.div`
  display: none;
  @media (max-width: 1200px) {
    display: block;
  }
`;
const SigninButton = styled.div`
  display: flex;
  & button {
    & span {
      @media (max-width: 576px) {
        padding: 0 !important;
        margin-right: 7px;
        font-size: 14px;
      }
    }
  }
`;

const NavMenu = ({
  isLoggedIn,
  handleMyCreatedBounty,
  BountyHandler,
  BountyImWorkedOnHandler,
  handleNewBounty,
  goToSignInPage,
  goToSignUpPage,
}) => {
  return (
    <NavMenuWrapper>
      {isLoggedIn ? (
        <>
          <div className="_btn-authed _btn_diplay">
            <ActionButton onPress={BountyHandler} isQuiet>
              All Bounties
            </ActionButton>
          </div>

          <div className="_btn-authed  _btn_diplay">
            <ActionButton onPress={handleMyCreatedBounty} isQuiet>
              My Created Bounties
            </ActionButton>
          </div>

          <div className="_btn-authed  _btn_diplay">
            <ActionButton onPress={BountyImWorkedOnHandler} isQuiet>
              Bounties I'm Working On
            </ActionButton>
          </div>
          {}
          <div className="_btn-authed create-new-bounty-mobile">
            <Button
              onPress={() => handleNewBounty("Create New Bounty")}
              isQuiet
            >
              Create New Bounty
            </Button>
          </div>
          <div className="_btn-authed create-new-bounty-mobile">
            <Button
              onPress={() => handleNewBounty("Create New Designated Bounty")}
              isQuiet
            >
              Create New Designated Bounty
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="_btn  _btn_diplay">
            <ActionButton isQuiet onPress={goToSignUpPage}>
              Sign-up
            </ActionButton>
          </div>
          <div className="_btn  _btn_diplay">
            <ActionButton isQuiet onPress={goToSignInPage}>
              Sign-in
            </ActionButton>
          </div>
        </>
      )}
    </NavMenuWrapper>
  );
};

const HamburgerButton = ({ open, setOpen }) => (
  <Hamburger toggled={open} toggle={setOpen} />
);

const AuthedNav = ({ navigate, currentUser, firebase }) => {
  // console.log('currentUser', currentUser.uid);
  const [state] = React.useContext(AppContext);
  const { toggleMode } = useUIControls();
  const handleMyCreatedBounty = () => navigate("/mybounties");
  const BountyHandler = () => navigate("/bounties");
  const BountyImWorkedOnHandler = () => navigate("/bountyworkedon");
  console.log("state =>", state);

  return (
    <AuthedNavWrapper>
      {/* <div className="_btn-authed">
        <ActionButton isQuiet onPress={handleMyBounty}>
          MyBounties
        </ActionButton>
      </div> */}

      <div className="_btn-authed">
        <ActionButton isQuiet onPress={BountyHandler}>
          All Bounties
        </ActionButton>
      </div>

      <div className="_btn-authed">
        <ActionButton isQuiet onPress={handleMyCreatedBounty}>
          My Created Bounties
        </ActionButton>
      </div>

      <div className="_btn-authed">
        <ActionButton isQuiet onPress={BountyImWorkedOnHandler}>
          Bounties I'm Working On
        </ActionButton>
      </div>

      {/* <div className="_btn-authed">
        <Switch onChange={toggleMode} />
        {state.mode}
      </div> */}
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
  const [searchValue, setSearchValue] = React.useState("Bounty");
  const [searchCharecter, setSearchCharecter] = React.useState("");
  const { setAccountId } = useAccountId();
  const currentUser = firebase.auth?.currentUser;
  const isLoggedIn = !!currentUser;
  const { theme } = state;
  const userProfileHandler = () => navigate("/userprofile");
  const handleSignIn = () => navigate("/sign-in");
  const handleSignOut = () => {
    firebase.signOut();
    setAccountId("");
  };
  const handleNewBounty = (key) => {
    console.log("key =>", key);
    navigate("/new-bounty", { state: { Bounty: key } });
  };

  const handleMyCreatedBounty = () => {
    navigate("/mybounties");
    setOpen(!open);
  };
  const BountyHandler = () => {
    setOpen(!open);
    navigate("/bounties");
  };
  const BountyImWorkedOnHandler = () => {
    setOpen(!open);
    navigate("/bountyworkedon");
  };

  const goToSignInPage = () => {
    setOpen(!open);
    navigate("/sign-in");
  };
  const goToSignUpPage = () => {
    setOpen(!open);
    navigate("/sign-up");
  };

  const searchHandler = (e) => {
    setSearchValue(e);
  };

  const searchCharecterHandler = (e) => {
    setSearchCharecter(e);
  };

  const searchsubmitHandler = (e) => {
    const keyword = searchCharecter;
    navigate("/search-result", {
      state: { keyword, value: searchValue },
    });
  };
  return (
    <>
      <NavBarWrapper>
        <NavControls>
          <NavMenuWrapper>
            <HamburgerWrapper>
              <HamburgerButton open={open} setOpen={setOpen} />
            </HamburgerWrapper>
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
            {state.accountId && (
              <SerachWrapper>
                <SearchFilter>
                  <ComboBox
                    onSelectionChange={searchHandler}
                    defaultInputValue={searchValue}
                  >
                    <Item key="Account">Account</Item>
                    <Item key="Bounty">Bounty</Item>
                  </ComboBox>
                </SearchFilter>
                <SearchInput>
                  <SearchField onChange={searchCharecterHandler} />
                </SearchInput>
                <SearchButton>
                  <Button onPress={searchsubmitHandler}>
                    <AiOutlineSearch />
                  </Button>
                </SearchButton>
              </SerachWrapper>
            )}

            <ConnectedButton>
              <Connection />
            </ConnectedButton>
            {state.accountId && (
              <CreateNewBounty>
                {/* <Button marginEnd={2} fo onPress={handleNewBounty}>
                  Create New Bounty
                </Button> */}
                <MenuTrigger>
                  <ActionButton>Create Bounty</ActionButton>
                  <Menu onAction={(key) => handleNewBounty(key)}>
                    <Item key="Create New Bounty">Create New Bounty</Item>
                    <Item key="Create New Designated Bounty">
                      Create New Designated Bounty
                    </Item>
                  </Menu>
                </MenuTrigger>
              </CreateNewBounty>
            )}

            <ActionButton onPress={reSize} isQuiet>
              <GiResize />
            </ActionButton>
            <ActionButton onPress={toggleTheme} isQuiet>
              {theme === "light" ? <GiSunset /> : <GiSunrise />}
            </ActionButton>
            <SigninButton>
              {state.accountId ? (
                <ActionButton isQuiet onPress={handleSignOut}>
                  Sign Out
                </ActionButton>
              ) : null}

              {!state.accountId ? (
                <ActionButton onPress={handleSignIn} isQuiet>
                  <AiOutlineLogin />
                </ActionButton>
              ) : (
                <ActionButton onPress={userProfileHandler} isQuiet>
                  <ImageIcon />
                </ActionButton>
              )}
            </SigninButton>
          </ThemeButtonContainer>
        </NavControls>
        {open && (
          <NavMenu
            isLoggedIn={isLoggedIn}
            handleMyCreatedBounty={handleMyCreatedBounty}
            BountyHandler={BountyHandler}
            BountyImWorkedOnHandler={BountyImWorkedOnHandler}
            handleNewBounty={handleNewBounty}
            goToSignInPage={goToSignInPage}
            goToSignUpPage={goToSignUpPage}
          />
        )}
        {state.accountId && (
          <SerachWrapperMobile>
            <SearchFilter>
              <ComboBox
                onSelectionChange={searchHandler}
                defaultInputValue={searchValue}
              >
                <Item key="Account">Account</Item>
                <Item key="Bounty">Bounty</Item>
              </ComboBox>
            </SearchFilter>
            <SearchInput>
              <SearchField onChange={searchCharecterHandler} />
            </SearchInput>
            <SearchButton>
              <Button onPress={searchsubmitHandler}>
                <AiOutlineSearch />
              </Button>
            </SearchButton>
          </SerachWrapperMobile>
        )}
      </NavBarWrapper>
    </>
  );
};

const NavBar = compose(withRouter, withFirebase)(NavBarBase);

export default NavBar;
