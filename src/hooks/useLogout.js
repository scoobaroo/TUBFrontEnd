import React from 'react';
import appConfig from "webpack-config-loader!../app-config.js";
import IdleTimer from '../helper/idle-timer';


const useLogout = () => {
    const [isTimeout, setIsTimeout] = React.useState(false);
    React.useEffect(() => {

    const timer = new IdleTimer({
      timeout: appConfig.timeOutDelay, //expire after 10 seconds
      onTimeout: () => {
        setIsTimeout(true);
      },
      onExpired: () => {
        // do something if expired on load
        setIsTimeout(true);
      }
    });

    return () => {
      timer.cleanUp();
    };

  }, []);
  return isTimeout;
}

export default useLogout