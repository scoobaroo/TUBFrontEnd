import React from "react";
import { AppContext } from "../context";
import axios from "axios";
import appConfig from "../app-config";

const useCertificationType = () => {
  const [state, setState] = React.useContext(AppContext);

  const setCertificationType = () => {
    const certificationurl = `${appConfig.development.apiBaseUrl}entityDefinitions/cob_certification/optionsets`;
    axios
      .get(certificationurl)
      .then((response) => {
        let NewCertificationType;
        if (response.status === 200 && window.localStorage) {
          const CeritificationType = [...new Set(response.data.value)];
          CeritificationType.forEach((education) => {
            NewCertificationType = education.OptionSet.Options;
          });
          console.log("NewCertificationType =>", response.data);

          // window.localStorage.setItem(
          //   "certificaitonType",
          //   JSON.stringify(NewCertificationType)
          // );

          setState((prevState) => ({
            ...prevState,
            EducationType: NewCertificationType,
          }));
        }
      })
      .catch((error) => {
        console.log("there was an error:", error);
      })
      .finally(() => {});
  };

  return {
    setCertificationType,
  };
};

export default useCertificationType;
