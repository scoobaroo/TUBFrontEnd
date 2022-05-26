import React from 'react';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';

const  withRouter = (Child) => {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <Child {...props} navigate={navigate} location={location} />;
  }
}

export default withRouter;
