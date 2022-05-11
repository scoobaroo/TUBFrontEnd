import React from 'react';
import { Link } from 'react-router-dom';
import {Button, TextField} from '@adobe/react-spectrum';
import { compose } from 'recompose';
import { withFirebase } from '../../firebase';
import withRouter from '../../session/withRouter';
import { initialState, passwordReggie, emailReggie } from './config';
import appConfig from 'webpack-config-loader!../../app-config.js';
import axios from 'axios';
import useAccountId from '../../hooks/useAccountId';

import FormContainer from '../../styled/FormContainer';

const SignInFormBase = (props) => {
  const [state, setState] = React.useState({ ...initialState });
  const {setAccountId} = useAccountId();

  const handleEmailChange = (val) => {
    const email = val;
    setState((prevState) => ({
      ...prevState,
      email
    }))
  }

  const handlePasswordChange = (val) => {
    const password = val;
    setState((prevState) => ({
      ...prevState,
      password
    }));
  }

  const enable = () => setState(state => ({ ...state, disabled: false }));
  const disable = () => setState(state => ({ ...state, disabled: true }));
  const validateField = (value, reggie) => reggie.test(String(value).toLowerCase());

  const setLoggedUserId = (uuid) => {
    axios.get(`${appConfig.apiBaseUrl}users/${uuid}`)
      .then((response) => {
        if (response.data && response.data.value) {
          const { data: { value } } = response;
          const [result] = value;
          const accountId = result.accountid;
          console.log('setting accountId =>', result.accountid);
          setAccountId(accountId);
          console.log('use this for next api call, blobject =>', result);
        }
      })
      .catch((error) => {
        console.log('there was error:', error);
      });   
  }

  const handleSignIn = () => {
    props.firebase.signUserIn(state.email, state.password)
      .then((data) => {
        const { user: { uid } } = data;
        setLoggedUserId(uid);
        localStorage.setItem('firbaseUid', uid);
        props.navigate('/');
      })
      .catch((err) => {
        setState(prevState => ({
          ...prevState,
          ...initialState,
          error: err.message
        }));
      })
  }

  React.useEffect(() => {
    const emailValidated = validateField(state.email, emailReggie);
    const pwValidated = validateField(state.password, passwordReggie);
    const allTerms = [emailValidated, pwValidated];

    if (!allTerms.includes(false)) {
      enable();
    } else {
      disable();
    }

  }, [state.email, state.password]);

  return (
    <FormContainer>
      {state.error && (
        <div>Error: {state.error}</div>
      )}
      <div>
        <h2>Sign In</h2>
      </div>
      <div>
        <TextField
          value={state.email}
          width='100%'
          onChange={handleEmailChange}
          type='email'
          label='Email' />
      </div>
      <div>
        <TextField
          value={state.password}
          width='100%'
          onChange={handlePasswordChange}
          type='password'
          label='Password' />
      </div>
      <div>
        <Button
          width='100%'
          onPress={handleSignIn}
          isDisabled={state.disabled}
          variant='cta'
          >
          Sign In
        </Button>
      </div>
      <div>
        <span>Not a member?</span>{` `}<Link to='/sign-up'>Sign Up</Link>
      </div>
      <div>
        <span>Forgot your password?</span>{` `}<Link to='/password-reset'>Reset Password</Link>
      </div>
    </FormContainer>
  );
}

const SignIn = compose(withRouter, withFirebase)(SignInFormBase);


export default SignIn;
