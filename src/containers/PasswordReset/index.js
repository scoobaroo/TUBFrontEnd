import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import {Button, TextField} from '@adobe/react-spectrum';
import { compose } from 'recompose';
import { withFirebase } from '../../firebase';
import withRouter from '../../session/withRouter';
import { initialState, emailReggie } from './config';
import { AppContext } from '../../context';

import FormContainer from '../../styled/FormContainer';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";

const ResetWrapper = styled.div`
  margin: 16px auto;
  max-width: 450px;
 flex:none !important;
  background: rgb(200 200 200 / 2%);
  border: 1px solid rgb(239 239 239 / 5%);
  border-radius: 5px;
padding: 25px;
min-width: 320px;

`;
const validateField = (value, reggie) => reggie.test(String(value).toLowerCase());

const ForgotPasswordForm = ({ firebase, navigate }) => {
  const [_state] = React.useContext(AppContext);
  const [state, setState] = React.useState({ ...initialState });
  const enable = () => setState(state => ({ ...state, disabled: false }));
  const disable = () => setState(state => ({ ...state, disabled: true }));
  const { theme } = _state;
  const notify = () => {
    toast.success('Check your email!', {
      position: "top-center",
      autoClose: 5000,
      theme: theme,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  }
  React.useEffect(() => {
    const emailValidated = validateField(state.email, emailReggie);
    if (emailValidated) {
      enable();
    } else {
      disable();
    }
  }, [state.email]);
  console.log('state =>', state);

  const handleEmailChange = (val) => {
    const email = val;
    setState((prevState) => ({
      ...prevState,
      email
    }))
  }

  const onSubmit = () => {
    firebase.passwordReset(state.email)
      .then(() => {
        notify();
        setState({...initialState});
      })
      .catch((err) => {
        setState(prevState => ({
          ...initialState,
          error: err.message
        }));
      })
  }

  return (
    <ResetWrapper>
    <FormContainer>
      <div>
        <h2>Reset Password</h2>
      </div>
      <div>
        <TextField
          width='100%'
          value={state.email}
          onChange={handleEmailChange}
          type='text'
          label='Email' />
      </div>
      <div>
        <Button width='100%' variant='cta' onPress={onSubmit} isDisabled={state.disabled}>
          Reset Password
        </Button>
      </div>
      <div>
        <span>Not a member?</span>{` `}<Link to='/sign-up'>Sign Up</Link>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </FormContainer>
    </ResetWrapper>
  )
}

const PasswordReset = compose(withRouter, withFirebase)(ForgotPasswordForm);


export default PasswordReset;
