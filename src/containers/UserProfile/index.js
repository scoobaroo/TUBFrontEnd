import React from "react";
import "./userProfile.css";
import styled from "styled-components";
import ReactStars from "react-rating-stars-component";
import {
  Button,
  Text,
  TextField,
  Heading,
  Well,
  DialogTrigger,
  AlertDialog,
  ProgressCircle,
  TabList,
  Tabs,
  Item,
  TabPanels,
  TableView,
  TableBody,
  TableHeader,
  Column,
  Row,
  Cell,
  ActionButton,
  Dialog,
  Flex,
  Divider,
  Link,
  Content,
  Form,
  ButtonGroup,
  ComboBox,
} from "@adobe/react-spectrum";
import { FaPlus } from "react-icons/fa";
import appConfig from "webpack-config-loader!../../app-config.js";
import axios from "axios";
import { withFirebase } from "../../firebase";
import withRouter from "../../session/withRouter";
import { compose } from "recompose";
import withAuthorization from "../../session/withAuthorization";
import { AppContext } from "../../context";
import ReviewDisplay from "../../components/ReviewDispay";
import { id } from "ethers/lib/utils";

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
  margin: 0 5px;
  & h3 {
    & div {
      @media (max-width: 576px) {
        width: 100%;
      }
    }
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 576px) {
    padding: 0 15px;
    max-width: 100%;
  }
  & .card,
  & .edit_profile {
    @media (max-width: 576px) {
      width: 100%;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 3px;
`;

const ModalWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const RatingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  & div {
    margin-left: 5px;
  }
`;

const ReviewWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 16px;
  grid-column-gap: 16px;
  margin: 16px;
  @media (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }
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
  customerRate,
  providerRate,
  edit,
}) => (
  <CardWrapper>
    <div className="card">
      <h1>User Profile</h1>
      <RatingWrapper>
        <h4>Customer Rating</h4>:
        <ReactStars
          count={5}
          edit={false}
          value={customerRate}
          size={26}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
        />
      </RatingWrapper>
      <RatingWrapper>
        <h4>Provider Rating</h4>:
        <ReactStars
          count={5}
          edit={false}
          value={providerRate}
          size={26}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
        />
      </RatingWrapper>
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
            {/* <Link>
              <a href={`${linkedInUrl}`} target="_blank">
                url
              </a>
            </Link> */}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>User email: </span>
            {email}
          </Heading>
          {edit && (
            <Button
              type="submit"
              variant="cta"
              marginTop={"15px"}
              marginStart={"auto"}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  </CardWrapper>
);

const Modal = ({
  onSetEducationType,
  onSetName,
  register,
  modal,
  openModal,
  closeModal,
  EducationType,
}) => (
  <ModalWrapper>
    <DialogTrigger isOpen={modal}>
      <ButtonWrapper>
        <ActionButton onPress={openModal}>
          <FaPlus />
        </ActionButton>
      </ButtonWrapper>
      <Dialog>
        <Heading>
          <Flex alignItems="center" gap="size-100">
            <Text>Educations</Text>
          </Flex>
        </Heading>
        <Divider />
        <Content>
          <Form>
            <TextField onChange={onSetName} label="Label Or Name" autoFocus />
            <ComboBox
              onSelectionChange={onSetEducationType}
              label="Education Type"
              items={EducationType}
            >
              {(item) => <Item key={item.Label}>{item.Label}</Item>}
            </ComboBox>
          </Form>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={closeModal}>
            Cancel
          </Button>
          <Button variant="cta" onPress={register}>
            Save
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogTrigger>
  </ModalWrapper>
);

const CertificationModal = ({
  onSetEducationType,
  onSetlabel,
  onSetName,
  register,
  modal,
  openModal,
  closeModal,
}) => (
  <DialogTrigger isOpen={modal}>
    <ButtonWrapper>
      <ActionButton marginY={"12px"} onPress={openModal}>
        <FaPlus />
      </ActionButton>
    </ButtonWrapper>
    <Dialog>
      <Heading>
        <Flex alignItems="center" gap="size-100">
          <Text>Certifications</Text>
        </Flex>
      </Heading>
      <Divider />
      <Content>
        <Form>
          <TextField onChange={onSetlabel} label="Label Or Name" autoFocus />
          <TextField onChange={onSetEducationType} label="Education Type" />
          <TextField onChange={onSetName} label="Name" />
        </Form>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={closeModal}>
          Cancel
        </Button>
        <Button variant="cta" onPress={register}>
          Save
        </Button>
      </ButtonGroup>
    </Dialog>
  </DialogTrigger>
);

const Edit = ({ onSubmit, children, EditCancel }) => (
  <CardWrapper>
    <div className="card">
      <h1>User Profile</h1>
      <form onSubmit={onSubmit}>
        {children}
        <div className="edit_profile">
          <ButtonWrapper>
            <Button onPress={EditCancel} variant="cta" marginTop={"15px"}>
              Cancel
            </Button>
          </ButtonWrapper>
          <ButtonWrapper>
            <Button type="submit" variant="cta" marginTop={"15px"}>
              save
            </Button>
          </ButtonWrapper>
        </div>
      </form>
    </div>
  </CardWrapper>
);

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
  };

  const InitialEducationState = {
    Name: "",
    EducationType: "",
  };

  const InitialCertificationState = {
    Nameorlabel: "",
    EducationType: "",
    Name: "",
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
  const [educationDetails, setEducationDetails] = React.useState({
    ...InitialEducationState,
  });
  const [certificationDetails, setCertificationDetails] = React.useState({
    ...InitialCertificationState,
  });
  const [showModal, setShowModal] = React.useState(false);
  const editable = props.location.state?.edit;
  const userId = props.location.state?.id
    ? props.location.state?.id
    : globalState.accountId;

  React.useEffect(() => {
    loadProfileDetails();
    loadReviewDetails();
  }, [props.location.state.id]);

  React.useEffect(() => {
    if(ratingData){
      providerRatingHandler();
      customerRatingHandler();
    }
  }, [ratingData]);

  React.useEffect(() => {
    const value = globalState.EducationType;
    setEducationType(value?.map((item) => item.Label.UserLocalizedLabel));
  }, []);

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
        }));
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const loadReviewDetails = () => {
    axios
      .get(`${appConfig.apiBaseUrl}ratings/users/${userId}`)
      .then((res) => {
        console.log("ASdfasdfsdaf", res);
        setRatingData(res.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const providerRatingHandler = () => {
    console.log("ratingData", ratingData);
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

    const userEdit = `${appConfig.apiBaseUrl}users/${globalState.accountId}/edit`;
    const userProfile = {
      FirstName: state.first_name,
      LastName: state.last_name,
      GithubUrl: state.gitHubUrl,
      LinkedInUrl: state.linkedInUrl,
      Telephone1: state.telephone,
      ProfilePicture: state.file,
    };
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
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const setEducationName = (e) => {
    setEducationDetails((prevState) => ({
      ...prevState,
      Name: e,
    }));
  };

  const setEducationtype = (e) => {
    setEducationDetails((prevState) => ({
      ...prevState,
      EducationType: e,
    }));
  };

  const setCertificationNameorLabel = (e) => {
    setCertificationDetails((prevState) => ({
      ...prevState,
      Nameorlabel: e,
    }));
  };

  const setCertificationType = (e) => {
    setCertificationDetails((prevState) => ({
      ...prevState,
      EducationType: e,
    }));
  };

  const SetcetificationName = (e) => {
    setCertificationDetails((prevState) => ({
      ...prevState,
      Name: e,
    }));
  };

  const formRegisterEducation = () => {
    setLoader(true);
    axios
      .post(
        `${appConfig.apiBaseUrl}users/${globalState.accountId}/educations/new`,
        educationDetails
      )
      .then((res) => {
        setLoader(false);
        setMessage((prevState) => ({
          ...prevState,
          EducationType: true,
          Certification: false,
        }));
        setShowSuccess(true);
        loadProfileDetails();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setShowBountyError(true);
      });
    setShowModal(false);
  };

  const formRegisterCertification = () => {
    setLoader(true);
    axios
      .post(
        `${appConfig.apiBaseUrl}users/${globalState.accountId}/certifications/new`,
        certificationDetails
      )
      .then((res) => {
        console.log(res);
        setMessage((prevState) => ({
          ...prevState,
          Certification: true,
          EducationType: false,
        }));
        setLoader(false);
        setShowSuccess(true);
        loadProfileDetails();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        setShowBountyError(true);
      });
    setShowModal(false);
  };

  const FormVAlidation = (e) => {
    setEducationDetails((prevState) => ({
      ...prevState,
      Name: e,
    }));
  };
  const EditCancel = () => {
    setState((prevState) => ({
      ...prevState,
      active: "profile",
    }));
  };

  return (
    <>
      {active === "edit" ? (
        <Edit onSubmit={handleSubmit} EditCancel={EditCancel}>
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
          customerRate={customerRate}
          providerRate={providerRate}
          edit={edit}
        />
      )}
      <Well margin="15px">
        <Tabs marginBottom="20px" aria-label="Education and Certifications">
          <TabList>
            <Item key="Edu">Educations</Item>
            <Item key="Cert">Certifications</Item>
            <Item key="customer_rating">Customer Rating</Item>
            <Item key="provider_rating">Provider Rating</Item>
          </TabList>

          <TabPanels>
            <Item key="Edu">
              <Modal
                onSetName={setEducationName}
                onSetEducationType={setEducationtype}
                register={formRegisterEducation}
                modal={showModal}
                openModal={openModal}
                closeModal={closeModal}
                EducationType={educationType}
              />
              <TableView>
                <TableHeader>
                  <Column>Degree</Column>
                  <Column align="end">Type</Column>
                </TableHeader>
                <TableBody>
                  {state.educationDetails?.map((item) => (
                    <Row>
                      <Cell>{item.cob_name}</Cell>
                      <Cell>
                        {
                          item[
                            "cob_educationtype@OData.Community.Display.V1.FormattedValue"
                          ]
                        }
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableView>
            </Item>
            <Item key="Cert">
              <CertificationModal
                onSetlabel={setCertificationNameorLabel}
                onSetEducationType={setCertificationType}
                onSetName={SetcetificationName}
                register={formRegisterCertification}
                modal={showModal}
                openModal={openModal}
                closeModal={closeModal}
              />
              <TableView>
                <TableHeader>
                  <Column>Certification</Column>
                  <Column align="end">Type</Column>
                </TableHeader>
                <TableBody>
                  {state.certifications?.map((item) => (
                    <Row>
                      <Cell>{item.cob_name}</Cell>
                      <Cell>{}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableView>
            </Item>
            <Item key="customer_rating">
              <ReviewWrapper>
                {customerReviewProvider.map((item) => (
                  <ReviewDisplay RateVAlue={item.cob_rating}>
                    <h3>{item.cob_name}</h3>
                    {item.cob_description}
                  </ReviewDisplay>
                ))}
              </ReviewWrapper>
            </Item>
            <Item key="provider_rating">
              <ReviewWrapper>
                {providerReviewCustomer.map((item) => (
                  <ReviewDisplay RateVAlue={item.cob_rating}>
                    <h3>{item.cob_name}</h3>

                    {item.cob_description}
                  </ReviewDisplay>
                ))}
              </ReviewWrapper>
            </Item>
          </TabPanels>
        </Tabs>
      </Well>
      <DialogTrigger isOpen={showSuccess}>
        <></>
        <AlertDialog
          title="Success"
          variant="information"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowSuccess(false)}
        >
          {message.EducationType
            ? "Education Added Successfully"
            : message.Certification
            ? "Certification Added Successfully"
            : "Profile saved successfully."}
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
