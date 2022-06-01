import React from "react";
import { AppContext } from "../context";
import axios from "axios";
import appConfig from "../././app-config";

const useRequestWork = ()=> {
  const [state, setState] = React.useContext(AppContext);

  const setRequestWork = () => {
    const educationurl = `${appConfig.development.apiBaseUrl}entityDefinitions/cob_requesttowork/optionsets`;
    axios
      .get(educationurl)
      .then((response) => {
        console.log("response =>", response);
        let  NewRequestWork
        if (response.status === 200 && window.localStorage) {
          const RequestWork = [...new Set(response.data.value)];
          RequestWork.forEach((education) => {
            NewRequestWork =  education.OptionSet.Options
          });
  
          window.localStorage.setItem("requestWork", JSON.stringify(NewRequestWork));

          setState((prevState) => ({
            ...prevState,
            RequestWork: NewRequestWork,
          }));
        }
      })
      .catch((error) => {
        console.log("there was an error:", error);
      })
      .finally(() => {});
  };

  return {
    setRequestWork,
  };
}

export default useRequestWork;