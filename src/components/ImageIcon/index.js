import React from "react";
import axios from "axios";
import styled from "styled-components";
import { AppContext } from "../../context";
import {
  createImageFromInitials,
  getRandomColor,
} from "../../helper/create-image-icon";
import appConfig from "webpack-config-loader!../../app-config.js";

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
`;

const ImageDiv = styled.div`
  border-radius: 50%;
  display: inline-block;
  position: relative;
  padding: 2px;
  cursor: pointer;
  background: linear-gradient(270deg, #3fa1a9, #79f1a4);
`;

// border-width: thin;
// border-style: solid;

const ImageIcon = (props) => {
  console.log("props =>", props.src);
  const [imageurl, setImageurl] = React.useState("");
  const [name, setName] = React.useState("");
  const [state] = React.useContext(AppContext);

  React.useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    await axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${state.accountId}`)
      .then((res) => {
        if (res.data.cob_profilepicture !== "") {
          const string2 = res.data.cob_profilepicture;
          const string1 = "data:image/png;base64,";
          setImageurl(string1.concat(string2));
        } else if (
          res.data.cob_firstname == null ||
          res.data.cob_lastname == null
        ) {
          setName(res.data.emailaddress1);
        } else {
          setName(res.data.cob_firstname + " " + res.data.cob_lastname);
        }
      })
      .catch((err) => {
        "navbar error =>", err;
      });
  };



  return (
    <>
      {imageurl ? (
        <ImageDiv>
          <ImageWrapper>
            <img src={imageurl} alt="profile" />
          </ImageWrapper>
        </ImageDiv>
      ) : (
        <ImageDiv>
          <ImageWrapper>
            <div>
              <img
                src={createImageFromInitials(
                  400,
                  name,
                  getRandomColor()
                )}
                alt=""
              />
            </div>
          </ImageWrapper>
        </ImageDiv>
      )}
    </>
  );
};

export default ImageIcon;
