import React from "react";
import "./userProfile.css";
import styled from "styled-components";
import { Button, TextField, Heading, DialogTrigger, AlertDialog,ProgressCircle } from "@adobe/react-spectrum";
import appConfig from "webpack-config-loader!../../app-config.js";
import axios from "axios";
import { withFirebase } from "../../firebase";
import withRouter from "../../session/withRouter";
import { compose } from "recompose";
import withAuthorization from "../../session/withAuthorization";

const ImgUpload = ({ onChange, src }) => (
  <label  className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img for="photo-upload" src={src} />
    </div>
    <input id="photo-upload" type="file" onChange={onChange} />
  </label>
);

const ProfileWrapper = styled.div`
  display: flex;
  justifycontent: "center";
  alignitems: "center";
`;

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Profile = ({
  onSubmit,
  src,
  telephone,
  linkedInUrl,
  gitHubUrl,
  email,
}) => (
  <div className="card_wrapper">
    <div className="card">
      <form onSubmit={onSubmit}>
        <h1>User Profile</h1>
        <label className="custom-file-upload fas">
          <div className="img-wrap">
            <img for="photo-upload" src={src} />
          </div>
        </label>
        <div className="item_wrapper">
          <Heading marginBottom="10">
            <span style={{ width: "50%", color: "#766e6e" }}>
              Telephone:{" "}
            </span>
            {telephone}
          </Heading>
        </div>
        <div className="item_wrapper">
          <Heading marginBottom="10">
            <span style={{ width: "50%", color: "#766e6e" }}>
              Github url:{" "}
            </span>
            {gitHubUrl}
          </Heading>
        </div>
        <div className="item_wrapper">
          <Heading marginBottom="10">
            <span style={{ width: "150px", color: "#766e6e" }}>
              LinekdIn url:{" "}
            </span>
            {linkedInUrl}
          </Heading>
        </div>
        <div className="item_wrapper">
          <Heading marginBottom="10">
            <span style={{ width: "150px", color: "#766e6e" }}>
              User email:{" "}
            </span>
            {email}
          </Heading>
        </div>
        <Button type="submit" variant="cta" marginTop={"15px"}>
          Edit Profile
        </Button>
      </form>
    </div>
  </div>
);

const Edit = ({ onSubmit, children }) => (
  <div className="card_wrapper">
    <div className="card">
      <form onSubmit={onSubmit}>
        <h1>User Profile</h1>
        {children}
        <Button type="submit" variant="cta" marginTop={"15px"}>
          save
        </Button>
      </form>
    </div>
  </div>
);

const UserProfileEdit = () => {
  const InitialState = {
    file: "",
    imagePreviewUrl:"",
    // https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true
    gitHubUrl: "",
    linkedInUrl: "",
    telephone: "",
    active: "profile",
    email: "",
  };

  const [state, setState] = React.useState({ ...InitialState });
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showBountyError, setShowBountyError] = React.useState(false);


  React.useEffect(() => {
    const FirabaseUid = localStorage.getItem("firbaseUid");
    axios
      .get(`${appConfig.apiBaseUrl}users/${FirabaseUid}`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          gitHubUrl: res.data.cob_githuburl,
          linkedInUrl: res.data.cob_linkedinurl,
          telephone: res.data.telephone1,
          imagePreviewUrl: res.data.imagePreviewUrl,
          email: res.data.emailaddress1,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      console.log("RESULT", reader.result);
      setState((prevState) => ({
        ...prevState,
        file: file,
        imagePreviewUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };
  const editLinkedInUrl = (e) => {
    const linkedInUrl = e;
    setState((prevState) => ({
      ...prevState,
      linkedInUrl,
    }));
  };

  const editTelphone = (e) => {
    const telephone = e;
    setState((prevState) => ({
      ...prevState,
      telephone,
    }));
  };

  const editGithupUrl = (e) => {
    const gitHubUrl = e;
    setState((prevState) => ({
      ...prevState,
      gitHubUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let activeP = state.active === "edit" ? "profile" : "edit";
   
      setState((prevState) => ({
        ...prevState,
        active: activeP,
      }));
    
    const userId = localStorage.getItem("accountId");
    const userEdit = `${appConfig.apiBaseUrl}users/${userId}/edit`;
    const userProfile = {
      GithubUrl: state.gitHubUrl,
      LinkedInUrl: state.linkedInUrl,
      Telephone1: state.telephone,
      ProfilePicture: state.imagePreviewUrl,
    };
    axios
      .patch(userEdit, userProfile)
      .then((res) => {
        console.log(res);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setShowBountyError(true);

      });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    let activeP = state.active === "edit" ? "profile" : "edit";
    setState((prevState) => ({
      ...prevState,
      active: activeP,
    }));
  };

  const { imagePreviewUrl, telephone, gitHubUrl, active, linkedInUrl, email } =
    state;

    if (state.email === "") {
        return (
          <LoadingWrapper>
            <div>
              <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </div>
            <div>please wait...</div>
          </LoadingWrapper>
        );
      }

  return (
    <div>
      {active === "edit" ? (
        <Edit onSubmit={handleSubmit}>
          <ImgUpload onChange={photoUpload} src={imagePreviewUrl} />
          <TextField
            onChange={(value) => {
              editGithupUrl(value);
            }}
            value={gitHubUrl}
            label="Github Url"
          />
          <TextField
            onChange={(value) => {
              editLinkedInUrl(value);
            }}
            value={linkedInUrl}
            label="LinkedIn Url"
          />
          <TextField
            onChange={(value) => {
              editTelphone(value);
            }}
            value={telephone}
            label="Telephone"
          />
        </Edit>
      ) : (
        <Profile
          onSubmit={handleEditSubmit}
          src={imagePreviewUrl}
          gitHubUrl={gitHubUrl}
          telephone={telephone}
          linkedInUrl={linkedInUrl}
          email={email}
        />
      )}
      <DialogTrigger isOpen={showSuccess}>
        <></>
        <AlertDialog
          title="Success"
          variant="information"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowSuccess(false)}
        >
          Profile saved successfully.
        </AlertDialog>
      </DialogTrigger>
      <DialogTrigger isOpen={showBountyError}>
        <></>
        <AlertDialog
          title="Failed"
          variant="error"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowBountyError(false)}
        >
          failed to update profile
        </AlertDialog>
      </DialogTrigger>
    </div>
  );
};

const UserProfile = compose(withRouter, withFirebase)(UserProfileEdit);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(UserProfile);
