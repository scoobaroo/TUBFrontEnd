import React from "react";
import axios from "axios";
import {
  Button,
  ProgressCircle,
  Well,
  Heading,
  DialogTrigger,
  AlertDialog,
} from "@adobe/react-spectrum";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import appConfig from "webpack-config-loader!../../app-config.js";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import { AppContext } from "../../context";
import { stat } from "fs";
import { VoidSigner } from "ethers";
import { AiFillStar } from "react-icons/ai";
import { ethers, getDefaultProvider, utils } from "ethers";
import abi from "../../abi/Bounty.json";

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BountyGrid = styled.div`
  border: 1px solid red;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 8px;
`;
// @media (max-width: 768px) {
//   grid-template-columns: repeat(2, 1fr);
// }

// @media (max-width: 576px) {
//   grid-template-columns: repeat(1, 1fr);
// }

const ViewBountyBox = styled.div`
  display: flex;
  @media (max-width: 576px) {
    flex-direction: column;
  }
  & button {
    margin-left: auto;
    flex-shrink: 0;
    @media (max-width: 576px) {
      margin-top: 8px;
    }
  }
`;
const ViewBountyBoxLeft = styled.div`
  margin-right: 15px;
`;
const RequestToWork = styled.div`
  padding: 15px;
  margin-top: 5px;
  border-radius: 7px;
  background: #2d2d2d;
  & h3 {
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px dashed #535353;
    padding-bottom: 7px;
    margin-bottom: 10px;
  }
`;

const RequestToWorkIn = styled.div`
  display: inline-flex;
  cursor: pointer;
  justify-content: flex-start;
  @media (max-width: 576px) {
    flex-direction: column;
  }
  & img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    @media (max-width: 576px) {
      margin-bottom: 10px;
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: 576px) {
    margin-top: 10px;
  }
  & button {
    margin-left: 10px;
  }
`;

const SelectedButton = styled.div`
  border-radius: 7px;
  background: #4d4c4c;
  padding: 10px;
  width: 120px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    margin-right: 5px;
  }
`;

const initialState = {
  allBounties: null,
  loading: true,
  error: null,
};

const requestToworkDetails = {
  first_name: "",
  last_name: "",
  email: "",
  profilePicture: "",
  message: "",
  Id: "",
  profiderId: "",
  linkedIn: "",
  github: "",
  telephone: "",
  education: [],
  certification: [],
  cob_providerId: "",
  cob_providerId2: "",
};

const BountiesBase = ({ firebase, navigate }) => {
  const [provider, setProvider] = React.useState(null);
  const [state] = React.useContext(AppContext);
  const [State, setState] = React.useState({ ...initialState });
  const [profile, setProfile] = React.useState(false);
  const [rwrkId, setRwrkId] = React.useState(null);
  const [requestworkloader, setRequestWorkLoader] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [requestToWork, setRequestToWork] = React.useState([
    { ...requestToworkDetails },
  ]);
  const [loader, setLoader] = React.useState(0);
  React.useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    setState((prevState) => ({
      ...prevState,
      allBounties: [],
      loading: true,
    }));
    getCustomerBounties();
    getAccountDetails();
  }, []);

  React.useEffect(() => {
    getAccountDetails();
  }, [State.allBounties]);

  const getCustomerBounties = async () => {
    setRequestWorkLoader(true);
    await axios
      .get(
        `${appConfig.apiBaseUrl}requestToWorks/customerid/${state.accountId}/`
      )
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          setRequestWorkLoader(false);
          const {
            data: { value },
          } = response;
          const allBounties = [...new Set(value)];
          setState((prevState) => ({
            ...prevState,
            allBounties,
            loading: false,
          }));
        }
      })
      .catch((error) => {
        setRequestWorkLoader(false);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error,
        }));
      });
  };

  const goToBounty = (bounty) => {
    navigate("/bountydetails", {
      state: {
        BountyId: bounty.cob_bountyid,
        SmartContractAddress: bounty.cob_smartcontractaddress,
      },
    });
  };

  const getAccountDetails = async () => {
    let providerId;
    State.allBounties?.map((bounty) => {
      if (bounty.cob_RequestToWork_bountyid_cob_Bounty.length > 0) {
        bounty.cob_RequestToWork_bountyid_cob_Bounty.map((value) => {
          providerId = value._cob_providerid_value;
          setLoader(loader + 1);
          axios
            .get(`${appConfig.apiBaseUrl}users/accountId/${providerId}`)
            .then((response) => {
              console.log("my create bouties", response);
              setLoader(loader - 1);
              if (response.status === 200) {
                setRequestToWork((prevState) => [
                  ...prevState,
                  {
                    first_name: response.data.cob_firstname,
                    last_name: response.data.cob_lastname,
                    email: response.data.emailaddress1,
                    profilePicture: response.data.cob_profilepicture,
                    message: value.cob_message,
                    Id: bounty["@odata.etag"],
                    profiderId: response.data.accountid,
                    linkedIn: response.data.cob_linkedinurl,
                    github: response.data.cob_githuburl,
                    telephone: response.data.telephone1,
                    requestToWorkdId: value.cob_requesttoworkid,
                    certification:
                      response.data.cob_Certification_providerid_Account,
                    education: response.data.cob_Education_providerid_Account,
                    cob_providerId: bounty._cob_providerid_value,
                    cob_providerId2: value._cob_providerid_value,
                  },
                ]);
              }
            })
            .catch((error) => {
              console.log("error", error);
              setLoader(loader - 1);
            });
        });
      }
    });
  };

  const ProfileViewer = (
    first_name,
    last_name,
    email,
    imageUr,
    linkedInl,
    github,
    telephone,
    certification,
    education
  ) => {
    navigate("/requesttoworkprofile", {
      state: {
        firstName: first_name,
        lastName: last_name,
        Email: email,
        Url: imageUr,
        linkedIn: linkedInl,
        Github: github,
        Telephone: telephone,
        Certification: certification,
        Education: education,
      },
    });
  };

  const setSmartContractAddress = async (smartContractAddress) => {
    console.log("smartContractAddress", smartContractAddress);
    setShowModal(false);
    let contract = new ethers.Contract(
      smartContractAddress,
      abi,
      provider.getSigner()
    );
    console.log("contract", contract);
    // let result = await contract.setprovider();
    // console.log("result", result);

  }

  const bountyAcceptHandler = async (requestToWorkId,cob_smartcontractaddress) => {
    setRwrkId(requestToWorkId);
    setRequestWorkLoader(true);
    setSmartContractAddress(cob_smartcontractaddress);
    await axios
      .patch(`${appConfig.apiBaseUrl}requestToWorks/${requestToWorkId}/approve`)
      .then((response) => {
        if (response.status === 200) {
          setShowModal(true);
          getCustomerBounties();
          setRequestWorkLoader(false);

          console.log("response", response);
        }
      })
      .catch((error) => {
        setRequestWorkLoader(false);
        console.log("error", error);
      });
  };

  const data = State.allBounties?.map((bounty) => (
    <Well key={bounty.cob_bountyid}>
      <ViewBountyBox>
        <ViewBountyBoxLeft>
          <div>
            <strong>Name</strong>: {bounty.cob_name}
          </div>
          <div>
            <strong>Description</strong>:{" "}
            {bounty.cob_description || `No Description`}
          </div>
        </ViewBountyBoxLeft>
        <Button marginY={"size-100"} onClick={() => goToBounty(bounty)}>
          View Bounty
        </Button>
      </ViewBountyBox>

      {bounty.cob_RequestToWork_bountyid_cob_Bounty.length > 0 &&
        requestToWork.map((value) => {
          let imageUrl;
          const string2 = value.profilePicture;
          const string1 = "data:image/png;base64,";
          imageUrl = string1.concat(string2);
          if (value.Id === bounty["@odata.etag"]) {
            return (
              <RequestToWork>
                <h3>Request to work</h3>

                <div key={value.Id}>
                  <RequestToWorkIn>
                    <img
                      onClick={() =>
                        ProfileViewer(
                          value.first_name,
                          value.last_name,
                          value.email,
                          imageUrl,
                          value.linkedIn,
                          value.github,
                          value.telephone,
                          value.certification,
                          value.education
                        )
                      }
                      src={imageUrl}
                    />
                    <div>
                      <div>
                        {value.first_name} {value.last_name}
                      </div>
                      <div>{value.email}</div>
                      <div>{value.message}</div>
                      {bounty._cob_providerid_value === value.cob_providerId2 && (
                        <SelectedButton>
                          <AiFillStar />
                          Selected
                        </SelectedButton>
                      )}
                    </div>
                  </RequestToWorkIn>
                  {bounty._cob_providerid_value === null ? (
                    <ButtonWrapper>
                      <Button
                        onPress={() => {
                          bountyAcceptHandler(value.requestToWorkdId,bounty.cob_smartcontractaddress);
                        }}
                        end
                        variant="cta"
                      >
                        {value.requestToWorkdId === rwrkId &&
                          requestworkloader && (
                          <ProgressCircle
                            aria-label="Loading…"
                            isIndeterminate
                          />
                        )} Accept
                      </Button>
                      <Button variant="negative"> Reject </Button>
                    </ButtonWrapper>
                  ) : null}
                </div>
              </RequestToWork>
            );
          }
        })}
    </Well>
  ));

  if ((State.loading && !State.bounties) || loader > 0) {
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
      <h2>Customer Bounties</h2>
      {State.allBounties && !State.loading && <BountyGrid>{data}</BountyGrid>}
      {State.loading && (
        <LoadingWrapper>
          <div>
            <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
          </div>
          <div>please wait...</div>
        </LoadingWrapper>
      )}
      <DialogTrigger isOpen={showModal}>
        <></>
        <AlertDialog
          title="Success"
          variant="information"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowModal(false)}
        >
          Bounty request accepted
        </AlertDialog>
      </DialogTrigger>
    </div>
  );
};

const MyCreatedBounties = compose(withRouter, withFirebase)(BountiesBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(MyCreatedBounties);
