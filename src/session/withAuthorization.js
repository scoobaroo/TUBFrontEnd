import React from 'react';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../firebase';
import withRouter from './withRouter';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            this.props.navigate('/sign-in');
          }
        }
      )
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return <Component {...this.props} />;
    }
  }

  return compose(withRouter, withFirebase)(WithAuthorization);
}

export default withAuthorization;
