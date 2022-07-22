import React from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  TextField,
  ProgressCircle,
} from "@adobe/react-spectrum";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import appConfig from "webpack-config-loader!../../app-config.js";
import { withFirebase } from "../../firebase"
import ReactDOM from "react-dom";;
import useAccountId from "../../hooks/useAccountId";
import withRouter from "../../session/withRouter";
import { initialState, emailReggie, passwordReggie } from "./config";
import FormContainer from "../../styled/FormContainer";
const validateField = (value, reggie) =>
  reggie.test(String(value).toLowerCase());
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification
} from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import styled from "styled-components";
import SuccessModal from "../../components/SuccessModal";

const SignUpWrapper = styled.div`
  margin: 16px auto;
  max-width: 450px;
  flex: none !important;
  background: rgb(200 200 200 / 2%);
  border: 1px solid rgb(239 239 239 / 5%);
  border-radius: 5px;
  padding: 25px;
`;
const VerificationWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: calc(100% - 62px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 62px;
  background: rgb(0 0 0 / 60%);
  p {
    margin-bottom: 15px;
  }
`;
const SignUpFormBase = (props) => {
  const [state, setState] = React.useState({ ...initialState });
  const { setAccountId } = useAccountId();
  const [mailVerficationLoader, setMailVerficationLoader] =
    React.useState(false);
  const auth =  getAuth();

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleAgreed = () => {
    setState((prevState) => ({
      ...prevState,
      agreed: !state.agreed,
    }));
  };

  const handleEmailChange = (val) => {
    const email = val;
    setState((prevState) => ({
      ...prevState,
      email,
    }));
  };

  const handlePasswordChange = (val) => {
    const password = val;
    setState((prevState) => ({
      ...prevState,
      password,
    }));
  };

  const _handlePasswordChange = (val) => {
    const _password = val;
    setState((prevState) => ({
      ...prevState,
      _password,
    }));
  };

  const enable = () => setState((state) => ({ ...state, disabled: false }));
  const disable = () => setState((state) => ({ ...state, disabled: true }));

  const onCreateUser = async () => {
   await props.firebase
      .createUser(auth, state.email, state.password)
      .then((data) => {
        const {
          user: { email, uid, name },
        } = data;
        onSubmitNewUser(email,uid);
        setMailVerficationLoader(true);
        sendEmailVerification(props.firebase.auth.currentUser)
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          ...initialState,
          error: err.message,
        }));
      })
      .finally(() => {
        // console.log('do action here');
      });
  };

  const onSubmitNewUser = async (email, uuid) => {
    const url = `${appConfig.apiBaseUrl}users/new?Email=${email}&FirebaseUid=${uuid}`;
   await axios
      .get(url)
      .then(({ data }) => {
        // const accountId = data.AccountId;
        console.log("setting accountId =>", accountId);
        // setAccountId(accountId);
      })
      .catch((error) => {
        console.log("there was an error", error);
      });
  };

  const emailVeificationHandler = () => {
    setMailVerficationLoader(false)
    props.navigate("/sign-in");
  }

  React.useEffect(() => {
    const emailValidated = validateField(state.email, emailReggie);
    const pwValidated = validateField(state.password, passwordReggie);
    const pwConfirmValidated = validateField(state._password, passwordReggie);
    const pwsMatch = state.password === state._password;
    const allTerms = [
      emailValidated,
      pwValidated,
      pwConfirmValidated,
      pwsMatch,
      state.agreed,
    ];

    if (!allTerms.includes(false)) {
      enable();
    } else {
      disable();
    }
  }, [state.email, state.password, state._password, state.agreed]);

  return (
    <SignUpWrapper>
      <FormContainer>
        {state.error && <div>Error: {state.error}</div>}
        <div>
          <h2>Sign Up</h2>
        </div>
        <div>
          <TextField
            width="100%"
            value={state.email}
            onChange={handleEmailChange}
            label="Email"
            type="text"
          />
        </div>
        <div>
          <TextField
            width="100%"
            value={state.password}
            onChange={handlePasswordChange}
            label="Password"
            type="password"
          />
        </div>
        <div>
          <TextField
            width="100%"
            value={state._password}
            onChange={_handlePasswordChange}
            label="Re-type Password"
            type="password"
          />
        </div>
        <div>
          <Checkbox
            isEmphasized
            isSelected={state.agreed}
            onChange={toggleAgreed}
          >
            {`I have read the terms and conditions.`}
          </Checkbox>
        </div>
        <Button
          width="100%"
          variant="cta"
          isDisabled={state.disabled}
          onClick={onCreateUser}
        >
          Sign Up
        </Button>
        <div>
          <span>Already signed up?</span>
          {` `}
          <Link to="/sign-in">Sign In</Link>
        </div>

        {mailVerficationLoader &&
          ReactDOM.createPortal(
            <SuccessModal
              message={"verification link sent to your mail"}
              title={"Success"}
              action={emailVeificationHandler}
              open={mailVerficationLoader}
            />,
            document.getElementById("modal")
          )}
      </FormContainer>
    </SignUpWrapper>
  );
};

const SignUp = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUp;
