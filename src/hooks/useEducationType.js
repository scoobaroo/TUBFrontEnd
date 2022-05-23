import React from "react";
import { AppContext } from "../context";
import axios from "axios";
import appConfig from "../././app-config";

export default function setEducationType () {
  const [state, setState] = React.useContext(AppContext);

  const setEducationType = () => {
    const educationurl = `${appConfig.development.apiBaseUrl}entityDefinitions/cob_education/optionsets`;
    axios
      .get(educationurl)
      .then(({ status, data }) => {
        if (status === 200 && window.localStorage) {
          const EducationType = [...new Set(data)];
          console.log("categories =>", categories);
          window.localStorage.setItem("educationType", JSON.stringify(EducationType));

          setState((prevState) => ({
            ...prevState,
            EducationType: EducationType,
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