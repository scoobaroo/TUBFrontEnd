import React from "react";
import { AppContext } from "../context";
import axios from "axios";
import appConfig from "../././app-config";

const  useCategory = () => {
  const [state, setState] = React.useContext(AppContext);

  const setCategory = () => {
    const categoriesUrl = `${appConfig.development.apiBaseUrl}categories`;
    axios
      .get(categoriesUrl)
      .then(({ status, data }) => {
        if (status === 200 && window.localStorage) {
          const categories = [...new Set(data)];
          console.log("categories =>", categories);
          window.localStorage.setItem("categorys", JSON.stringify(categories));

          setState((prevState) => ({
            ...prevState,
            categorys: categories,
          }));
        }
      })
      .catch((error) => {
        console.log("there was an error:", error);
      })
      .finally(() => {});
  };

  return {
    setCategory,
  };
}

export default useCategory;
