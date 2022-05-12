import React from "react";
import "./userProfile.css";
import styled from "styled-components";
import {
  Button,
  TextField,
  Heading,
  DialogTrigger,
  AlertDialog,
  ProgressCircle,
} from "@adobe/react-spectrum";
import appConfig from "webpack-config-loader!../../app-config.js";
import axios from "axios";
import { withFirebase } from "../../firebase";
import withRouter from "../../session/withRouter";
import { compose } from "recompose";
import withAuthorization from "../../session/withAuthorization";
import { AppContext } from "../../context";

const ImgUpload = ({ onChange, src }) => (
  <label className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img src={src} />
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

const InputFieldWrapper = styled.div`
  margin: 5px;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Profile = ({
  onSubmit,
  src,
  telephone,
  linkedInUrl,
  gitHubUrl,
  email,
  first_name,
  last_name,
}) => (
  <CardWrapper>
    <div className="card">
      <h1>User Profile</h1>
      <form onSubmit={onSubmit}>
        <label className="custom-file-upload fas">
          <div className="img-wrap">
            <img src={src} />
          </div>
        </label>
        <div className="item_wrapper">
          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>First Name: </span>
            {first_name}
          </Heading>
          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>Last Name: </span>
            {last_name}
          </Heading>
          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>Telephone: </span>
            {telephone}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>Github url: </span>
            {gitHubUrl}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>LinekdIn url: </span>
            {linkedInUrl}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>User email: </span>
            {email}
          </Heading>
          <Button
            type="submit"
            variant="cta"
            marginTop={"15px"}
            marginStart={"auto"}
          >
            Edit Profile
          </Button>
        </div>
      </form>
    </div>
  </CardWrapper>
);

const Edit = ({ onSubmit, children }) => (
  <CardWrapper>
    <div className="card">
      <h1>User Profile</h1>
      <form onSubmit={onSubmit}>
        {children}
        <div className="edit_profile">
          <Button type="submit" variant="cta" marginTop={"15px"}>
            save
          </Button>
        </div>
      </form>
    </div>
  </CardWrapper>
);

const UserProfileEdit = () => {
  const InitialState = {
    file: "",
    imagePreviewUrl:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    gitHubUrl: "",
    linkedInUrl: "",
    telephone: "",
    active: "profile",
    email: "",
    first_name: "",
    last_name: "",
  };

  const [globalState] = React.useContext(AppContext);
  const [state, setState] = React.useState({ ...InitialState });
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showBountyError, setShowBountyError] = React.useState(false);
  const [loader, setLoader] = React.useState(false);

  React.useEffect(() => {
    loadProfileDetails();
  }, []);

  const loadProfileDetails = () => {
    axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${globalState.accountId}`)
      .then((res) => {
        let imageUrl;
        if (res.data.cob_profilepicture !== "") {
          const string2 = res.data.cob_profilepicture;
          const string1 = "data:image/png;base64,";
          imageUrl = string1.concat(string2);
        } else {
          imageUrl =
            "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true";
        }

        setState((prevState) => ({
          ...prevState,
          gitHubUrl: res.data.cob_githuburl,
          linkedInUrl: res.data.cob_linkedinurl,
          telephone: res.data.telephone1,
          imagePreviewUrl: imageUrl,
          email: res.data.emailaddress1,
          first_name: res.data.cob_firstname,
          last_name: res.data.cob_lastname,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      console.log("RESULT", reader.result);
      const strImage = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
      setState((prevState) => ({
        ...prevState,
        file: strImage,
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

  const EditFirstName = (e) => {
    const first_name = e;
    setState((prevState) => ({
      ...prevState,
      first_name,
    }));
  };
  const EditLastName = (e) => {
    const last_name = e;
    setState((prevState) => ({
      ...prevState,
      last_name,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let activeP = state.active === "edit" ? "profile" : "edit";

    setState((prevState) => ({
      ...prevState,
      active: activeP,
    }));

    const userEdit = `${appConfig.apiBaseUrl}users/${globalState.accountId}/edit`;
    const userProfile = {
      GithubUrl: state.gitHubUrl,
      LinkedInUrl: state.linkedInUrl,
      Telephone1: state.telephone,
      ProfilePicture: state.file,
    };
    setLoader(true);
    axios
      .patch(userEdit, userProfile)
      .then((res) => {
        console.log(res);
        setLoader(false);
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

  const {
    imagePreviewUrl,
    telephone,
    gitHubUrl,
    active,
    linkedInUrl,
    email,
    first_name,
    last_name,
  } = state;

  if (state.email === "" || loader) {
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
    <>
      {active === "edit" ? (
        <Edit onSubmit={handleSubmit}>
          <ImgUpload onChange={photoUpload} src={imagePreviewUrl} />
          <div className="item_wrapper">
            <InputFieldWrapper>
              <Heading marginBottom="10">
                <span style={{ color: "#766e6e" }}>First Name: </span>
                <TextField
                  onChange={(value) => {
                    EditFirstName(value);
                  }}
                  value={first_name}
                />
              </Heading>
            </InputFieldWrapper>
            <InputFieldWrapper>
              <Heading marginBottom="10">
                <span style={{ color: "#766e6e" }}>Last Name: </span>
                <TextField
                  onChange={(value) => {
                    EditLastName(value);
                  }}
                  value={last_name}
                />
              </Heading>
            </InputFieldWrapper>
            <InputFieldWrapper>
              <Heading marginBottom="10">
                <span style={{ color: "#766e6e" }}>Github url: </span>
                <TextField
                  onChange={(value) => {
                    editGithupUrl(value);
                  }}
                  value={gitHubUrl}
                />
              </Heading>
            </InputFieldWrapper>
            <InputFieldWrapper>
              <Heading marginBottom="10">
                <span style={{ color: "#766e6e" }}>LinekdIn url: </span>
                <TextField
                  onChange={(value) => {
                    editLinkedInUrl(value);
                  }}
                  value={linkedInUrl}
                />
              </Heading>
            </InputFieldWrapper>

            <InputFieldWrapper>
              <Heading marginBottom="10">
                <span style={{ color: "#766e6e" }}>Telephone: </span>
                <TextField
                  onChange={(value) => {
                    editTelphone(value);
                  }}
                  value={telephone}
                />
              </Heading>
            </InputFieldWrapper>
          </div>
        </Edit>
      ) : (
        <Profile
          onSubmit={handleEditSubmit}
          src={imagePreviewUrl}
          gitHubUrl={gitHubUrl}
          telephone={telephone}
          linkedInUrl={linkedInUrl}
          last_name={last_name}
          first_name={first_name}
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
    </>
  );
};

const UserProfile = compose(withRouter, withFirebase)(UserProfileEdit);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(UserProfile);
