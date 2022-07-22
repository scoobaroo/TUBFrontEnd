import React from "react";
import styled from "styled-components";
import { Button, TextField } from "@adobe/react-spectrum";
import { compose } from "recompose";
import { withFirebase } from "../../../firebase";
import withRouter from "../../../session/withRouter";
import ErrorModal from "../../../components/ErrorModal";
import ReactDOM from "react-dom";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  EmailAuthProvider,
  linkWithCredential,
  linkWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";

const OtpWrapper = styled.div`
  margin: 16px auto;
  max-width: 450px;
  flex: none !important;
  background: rgb(200 200 200 / 2%);
  border: 1px solid rgb(239 239 239 / 5%);
  border-radius: 5px;
  padding: 25px;
`;

const OtpVerificationBase = (props) => {
  const countryCode = "+91";
  const [value, setValue] = React.useState(countryCode);
  const [open, setOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [invalidOtp, setInvalidOtp] = React.useState(false);
  const [validPhoneNumber, setValidPhoneNumber] = React.useState(false);

  const genarateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      },
      props.firebase.auth
    );
  };

  const otpHandler = async () => {
    if (value.length == 13) {
      genarateRecaptcha();
      let appVerifier = window.recaptchaVerifier;

      await linkWithPhoneNumber(
        props.firebase.auth.currentUser,
        value,
        appVerifier
      )
        .then((result) => {
          console.log(result);
          setExpand(true);
          window.confirmationResult = result;
        })
        .catch((error) => {
          setValidPhoneNumber(true);
        });
    }else{
      setValidPhoneNumber(true);
    }
  };

  const otpConfirmHandler = async () => {
    const credential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      otp
    );
    console.log(window.confirmationResult);
    if (credential) {
      await window.confirmationResult
        .onConfirmation(credential)
        .then((result) => {
          setInvalidOtp(false);
          console.log(result);
          const user = result.user;
          props.onSubmitNewUser()
        })
        .catch((error) => {
          console.log(error);
          setInvalidOtp(true);
        });
    }

    window.recaptchaVerifier.clear();
  };

  return (
    <OtpWrapper>
      <>
        <h2>OTP Verification</h2>
        <TextField
          width="100%"
          value={value}
          onChange={setValue}
          label="Mobile Number"
          type="text"
          marginBottom={16}
          isReadOnly={expand}
        />
        {!expand && (
          <Button
            id="sign-in-button"
            width="100%"
            variant="cta"
            onPress={otpHandler}
          >
            Sent
          </Button>
        )}

        {expand && (
          <>
            <TextField
              width="100%"
              value={otp}
              onChange={setOtp}
              type="text"
              label="Enter OTP"
              marginBottom="10px"
            />
            <Button width="100%" variant="cta" onPress={otpConfirmHandler}>
              Confirm
            </Button>
          </>
        )}
        {props.phoneVerification &&
          ReactDOM.createPortal(
            <ErrorModal
              open={props.phoneVerification}
              action={() => props.setphoneVerification(false)}
              message={"Please add a phone number to your account"}
            />,
            document.getElementById("modal")
          )}

        {invalidOtp &&
          ReactDOM.createPortal(
            <ErrorModal
              open={invalidOtp}
              action={() => setInvalidOtp(false)}
              message={"Invalid OTP"}
            />,
            document.getElementById("modal")
          )}

        {validPhoneNumber &&
          ReactDOM.createPortal(
            <ErrorModal
              open={validPhoneNumber}
              action={() => setValidPhoneNumber(false)}
              message={"Enter a valid phone number"}
            />,
            document.getElementById("modal")
          )}
      </>
    </OtpWrapper>
  );
};
const OtpVerification = compose(withRouter, withFirebase)(OtpVerificationBase);

export default OtpVerification;
