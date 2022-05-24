import React from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../firebase";
import withRouter from "./withRouter";
import { AppContext } from "../context";
import useLogout from "../hooks/useLogout";
import useAccountId from "../hooks/useAccountId";
import { DialogTrigger, AlertDialog } from "@adobe/react-spectrum";
import appConfig from "webpack-config-loader!../app-config.js";

const withAuthorization = (condition) => (Component) => {
  const WithAuthorization = (props) => {
    const { setAccountId } = useAccountId();
    const [_state] = React.useContext(AppContext);
    const isTimeout = useLogout();
    const [showModal, setShowModal] = React.useState(false);

    const Time = appConfig.timeOutDelay / 60

    let listener;
    React.useEffect(() => {
      listener = props.firebase.auth.onAuthStateChanged((authUser) => {
        if (!condition(authUser)) {
          props.navigate("/sign-in");
        }
      });
      return () => {
        listener();
      };
    }, []);

    const openModal = () => {
      <Modal />;
    };

    React.useEffect(() => {
      if (isTimeout === true && _state.accountId !== "") {
        console.log("isTimeout", isTimeout);
        setAccountId("");
        props.firebase.signOut();
        props.navigate("/sign-in");
        setShowModal(true);
      }
    }, [isTimeout]);
    return (
      <>
        <Component {...props} />
        <DialogTrigger isOpen={showModal}>
          <></>
          <AlertDialog
            title="Success"
            variant="information"
            primaryActionLabel="OK"
            onPrimaryAction={() => setShowModal(false)}
          >
           {`you have been logged out due to ${Time} minutes of inactivity.`} 
          </AlertDialog>
        </DialogTrigger>
      </>
    );
  };

  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
