import React from 'react';
import axios from 'axios';
import {Button, Checkbox, TextField} from '@adobe/react-spectrum';
import {Link} from 'react-router-dom';
import { compose } from 'recompose';
import appConfig from 'webpack-config-loader!../../app-config.js';
import { withFirebase } from '../../firebase';
import useAccountId from '../../hooks/useAccountId';
import withRouter from '../../session/withRouter';
import {initialState, emailReggie, passwordReggie} from './config';
import FormContainer from '../../styled/FormContainer';
const validateField = (value, reggie) => reggie.test(String(value).toLowerCase());
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";


const SignUpFormBase = props => {
  const [state, setState] = React.useState({ ...initialState });
  const {setAccountId} = useAccountId();
  

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const toggleAgreed = () => {
    setState((prevState) => ({
      ...prevState,
      agreed: !state.agreed
    }));
  }

  const handleEmailChange = val => {
    const email = val;
    setState((prevState) => ({
      ...prevState,
      email,
    }));
  }

  const handlePasswordChange = val => {
    const password = val;
    setState((prevState) => ({
      ...prevState,
      password,
    }));
  }

  const _handlePasswordChange = val => {
    const _password = val;
    setState((prevState) => ({
      ...prevState,
      _password,
    }));
  }

  const enable = () => setState(state => ({ ...state, disabled: false }));
  const disable = () => setState(state => ({ ...state, disabled: true }));

  const onSubmit = () => {
    console.log('send this, state =>', state);
  }

  const onSubmitNewUser = (email, uuid) => {
    const url = `${appConfig.apiBaseUrl}users/new?Email=${email}&FirebaseUid=${uuid}`;
    axios.get(url)
      .then(({data}) => {
        const accountId = data.AccountId;
        console.log('setting accountId =>', accountId);
        setAccountId(accountId);
      })
      .catch((error) => {
        console.log('there was an error', error);
      })
  }

  const onCreateUser = async () => {
    sendSignInLinkToEmail(props.firebase.auth, email, actionCodeSettings)
    // .then(() => {
    //   // The link was successfully sent. Inform the user.
    //   // Save the email locally so you don't need to ask the user for it again
    //   // if they open the link on the same device.
    //   window.localStorage.setItem('emailForSignIn', email);
    //   // ...
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // ...
    // });
    props.firebase.createUser(props.firebase.auth, state.email, state.password)
      .then((data) => {
        const { user: { email, uid, name } } = data;
        onSubmitNewUser(email, uid);
        addtoFirestore(uid,email,name);
        props.navigate('/');
      })
      .catch((err) => {
        setState(prevState => ({
          ...prevState,
          ...initialState,
          error: err.message
        }));
      })
      .finally(() => {
        // console.log('do action here');
      })
  }

  // const actionCodeSettings = {
  //   // URL you want to redirect back to. The domain (www.example.com) for this
  //   // URL must be in the authorized domains list in the Firebase Console.
  //   url: 'http://localhost:9000/sign-in',
  //   // This must be true.
  //   handleCodeInApp: true,
  //   dynamicLinkDomain: 'http://localhost:9000/sign-in'
  // };

  
 

  const addtoFirestore = async (uid,email,name) => {
    await setDoc(doc(props.firebase.db, "users",uid), {
      uid: uid,
      email,
      createdAt: Timestamp.fromDate(new Date()),
      isOnline: true,
    });
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
      state.agreed
    ];

    if (!allTerms.includes(false)) {
      enable();
    } else {
      disable();
    }

  }, [state.email, state.password, state._password, state.agreed]);

  return (
    <FormContainer>
      {state.error && (
        <div>Error: {state.error}</div>
      )}
      <div>
        <h2>Sign Up</h2>
      </div>
      <div>
        <TextField
          width='100%'
          value={state.email}
          onChange={handleEmailChange}
          label='Email'
          type='text' />
      </div>
      <div>
        <TextField
          width='100%'
          value={state.password}
          onChange={handlePasswordChange}
          label='Password'
          type='password' />
      </div>
      <div>
        <TextField
          width='100%'
          value={state._password}
          onChange={_handlePasswordChange}
          label='Re-type Password'
          type='password' />
      </div>
      <div>
        <Checkbox isEmphasized isSelected={state.agreed} onChange={toggleAgreed}>
          {`I have read the terms and conditions.`}
        </Checkbox>
      </div>
      <Button
        width='100%'
        variant='cta'
        isDisabled={state.disabled}
        onClick={onCreateUser}>
        Sign Up
      </Button>
      <div>
        <span>Already signed up?</span>{` `}<Link to='/sign-in'>Sign In</Link>
      </div>
    </FormContainer>
  )
}

const SignUp = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUp;
