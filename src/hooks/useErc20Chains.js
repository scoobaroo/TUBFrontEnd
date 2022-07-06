import React from 'react'
import { AppContext } from "../context";
import axios from "axios";
import appConfig from "../././app-config";

const useErc20Chains = () => {
    const [state, setState] = React.useContext(AppContext);

    const setErc20Chains = () => {
      const erc20url = `${appConfig.development.apiBaseUrl}erc20chains/async`;
      axios
        .get(erc20url)
        .then(( response ) => {
          if (response.status === 200 && window.localStorage) {
            const erc20chains = [...new Set(response.data.value)];
            console.log("categories =>", erc20chains);
            window.localStorage.setItem("erc20chains", JSON.stringify(erc20chains));
  
            setState((prevState) => ({
              ...prevState,
              Erc20Chains: erc20chains,
            }));
          }
        })
        .catch((error) => {
          console.log("there was an error:", error);
        })
        .finally(() => {});
    };
    return {
        setErc20Chains
      };
  
}

export default useErc20Chains