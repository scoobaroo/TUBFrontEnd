import React from "react";
import "./userProfile.css";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import Profile from "./components/Profile";
import ProfileEdit from "./components/ProfileEdit";
import Tables from "./components/Tables";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import {
  TextField,
  Heading,
  Well,
  ProgressCircle,
} from "@adobe/react-spectrum";
import appConfig from "webpack-config-loader!../../app-config.js";
import axios from "axios";
import { withFirebase } from "../../firebase";
import withRouter from "../../session/withRouter";
import { compose } from "recompose";
import withAuthorization from "../../session/withAuthorization";
import { AppContext } from "../../context";
import ImageUpload from "./components/ImageUpload";

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileTableWrapper = styled.div`
  flex:none !important;
`;
const InputFieldWrapper = styled.div`
  margin:  5px;
  & h3 {
    & div {
      @media (max-width: 576px) {
        width: 100%;
      }
    }
  }
`;

const UserProfileEdit = (props) => {
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
    educationDetails: [],
    certifications: [],
    customerRate: 0,
    providerRate: 0,
    edit: true,
    firbaseUid: "",
  };

  const InitalMessage = {
    EducationType: false,
    Certification: false,
  };

  const [message, setMessage] = React.useState({ ...InitalMessage });
  const [customerReviewProvider, setcustomerReviewProvider] = React.useState(
    []
  );
  const [providerReviewCustomer, setproviderReviewCustomer] = React.useState(
    []
  );
  const [ratingData, setRatingData] = React.useState([]);
  const [globalState] = React.useContext(AppContext);
  const [state, setState] = React.useState({ ...InitialState });
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showBountyError, setShowBountyError] = React.useState(false);
  const [educationType, setEducationType] = React.useState();
  const [loader, setLoader] = React.useState(false);
  const [loginUser, setLoginUser] = React.useState(false);
  const [userDetailsHashing, setUserDetailsHashing] = React.useState(false);
  const [bountyDetails, setBountyDetails] = React.useState([]);
  const [education, setEducation] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const editable = props.location.state?.edit;
  const userId = props.location.state?.id
    ? props.location.state?.id
    : globalState.accountId;

  React.useEffect(() => {
    loadProfileDetails();
    loadReviewDetails();
  }, [props.location.state.id]);

  React.useEffect(() => {
    myBountyDetails();
  }, [editable]);

  React.useEffect(() => {
    if (ratingData) {
      providerRatingHandler();
      customerRatingHandler();
    }
  }, [ratingData]);

  React.useEffect(() => {
    const value = globalState.EducationType;
    setEducationType(value?.map((item) => item.Label.UserLocalizedLabel));
    if (userId) props.navigate("/bountydetails");
  }, []);

  React.useEffect(() => {
    if (bountyDetails.length > 0) {
      providerIdChekingHandler();
    }
  }, [bountyDetails]);

  const myBountyDetails = async () => {
    await axios
      .get(`${appConfig.apiBaseUrl}users/${userId}/customerbounties`)
      .then((res) => {
        console.log(res.data);
        setBountyDetails(res.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadProfileDetails = () => {
    setLoader(true);
    axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${userId}`)
      .then((res) => {
        setLoader(false);
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
          educationDetails: res.data.cob_Education_providerid_Account,
          certifications: res.data.cob_Certification_providerid_Account,
          customerRate: res.data.cob_customerrating,
          providerRate: res.data.cob_providerrating,
          edit: editable,
          firbaseUid: res.data.cob_firebaseuid,
        }));
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const providerIdChekingHandler = () => {
    if (globalState.accountId === userId) setLoginUser(true);

    const index = bountyDetails.findIndex(
      (item) => item._cob_providerid_value == globalState.accountId
    );
    if (index > -1) {
      setUserDetailsHashing(true);
    }
  };

  const loadReviewDetails = () => {
    axios
      .get(`${appConfig.apiBaseUrl}ratings/users/${userId}`)
      .then((res) => {
        setRatingData(res.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const providerRatingHandler = () => {
    const providerReview = ratingData.filter(
      (item) =>
        item["cob_ratingtype@OData.Community.Display.V1.FormattedValue"] ===
          "Customer Review of Provider" && item._cob_providerid_value === userId
    );
    setproviderReviewCustomer(providerReview);
  };

  const customerRatingHandler = () => {
    const customerReview = ratingData.filter(
      (item) =>
        item["cob_ratingtype@OData.Community.Display.V1.FormattedValue"] ===
          "Provider Review of Customer" && item._cob_customerid_value === userId
    );
    setcustomerReviewProvider(customerReview);
  };

  console.log("customerReviewProvider", customerReviewProvider);

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
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

    const addtoFirestore = async (firstName, lastName, profilePicture) => {
      await updateDoc(doc(props.firebase.db, "users", state.firbaseUid), {
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePicture,
      });
    };

    const userEdit = `${appConfig.apiBaseUrl}users/${globalState.accountId}/edit`;
    const userProfile = {
      FirstName: state.first_name,
      LastName: state.last_name,
      GithubUrl: state.gitHubUrl,
      LinkedInUrl: state.linkedInUrl,
      Telephone1: state.telephone,
      ProfilePicture: state.file,
    };
    addtoFirestore(state.first_name, state.last_name, state.file);
    setLoader(true);
    axios
      .patch(userEdit, userProfile)
      .then((res) => {
        setMessage((prevState) => ({
          ...prevState,
          EducationType: false,
          Certification: false,
        }));
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

  const EditCancel = () => {
    setState((prevState) => ({
      ...prevState,
      active: "profile",
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
    customerRate,
    providerRate,
    edit,
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
    <div>
      {active === "edit" ? (
        <ProfileEdit onSubmit={handleSubmit} EditCancel={EditCancel}>
          <ImageUpload onChange={photoUpload} src={imagePreviewUrl} />
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
        </ProfileEdit>
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
          customerRate={customerRate}
          providerRate={providerRate}
          edit={edit}
          hashing={userDetailsHashing}
          loginUser={loginUser}
        />
      )}
      <ProfileTableWrapper>
      <Well margin="15px">
        <Tables
          educationDetails={state.educationDetails}
          cetification={state.certifications}
          CustomerReviewOfProvider={customerReviewProvider}
          ProviderReviewOfDisplay={providerReviewCustomer}
          loader={setLoader}
          profileDetails={() => loadProfileDetails()}
          success={setSuccess}
          error={setError}
          educatoion={setEducation}
        />
      </Well>
      </ProfileTableWrapper>

      {showSuccess && (
        <SuccessModal
          open={showSuccess}
          title={"Success"}
          message={"Profile saved successfully"}
          action={() => setShowSuccess(false)}
        ></SuccessModal>
      )}
      {showBountyError && (
        <ErrorModal
          open={showBountyError}
          message={" failed to update profile"}
          action={() => setShowBountyError(false)}
        ></ErrorModal>
      )}
      {success && (
        <SuccessModal
          open={success}
          title={"Success"}
          message={`${
            education
              ? "Education Added Successfully"
              : "Certification Added Successfully"
          }`}
          action={() => setSuccess(false)}
        />
      )}

      {error && (
        <ErrorModal
          open={error}
          action={() => setError(false)}
          message={"creation failed"}
        />
      )}
    </div>
  );
};

const UserProfile = compose(withRouter, withFirebase)(UserProfileEdit);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(UserProfile);
