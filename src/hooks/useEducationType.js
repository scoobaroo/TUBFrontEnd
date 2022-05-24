import React from "react";
import { AppContext } from "../context";
import axios from "axios";
import appConfig from "../././app-config";

const useEducaitonType = ()=> {
  const [state, setState] = React.useContext(AppContext);

  const setEducationType = () => {
    const educationurl = `${appConfig.development.apiBaseUrl}entityDefinitions/cob_education/optionsets`;
    axios
      .get(educationurl)
      .then((response) => {
        let  NewEducationType
        if (response.status === 200 && window.localStorage) {
          const EducationType = [...new Set(response.data.value)];
          EducationType.forEach((education) => {
          NewEducationType =  education.OptionSet.Options
          });
  
          window.localStorage.setItem("educationType", JSON.stringify(NewEducationType));

          setState((prevState) => ({
            ...prevState,
            EducationType: NewEducationType,
          }));
        }
      })
      .catch((error) => {
        console.log("there was an error:", error);
      })
      .finally(() => {});
  };

  return {
    setEducationType,
  };
}

export default useEducaitonType;