import React from "react";
import axios from "axios";
import {
  Button,
  ProgressCircle,
  Well,
  DialogTrigger,
  AlertDialog,
  Dialog,
  Heading,
  Content,
  Divider,
  TextArea,
  Text,
  ButtonGroup,
  TextField,
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
import ReactStars from "react-rating-stars-component";

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

const ItemWrapperRating = styled.div`
  display: flex;
  flex-direction: column;
  & div {
    width: 100%;
  }
  & button {
    width: 110px;
    margin: 12px 0 0 10px;
  }
  & input {
    margin-bottom: 10px;
  }
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
  position: relative;
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

const ButtonReleaseWrapper = styled.div`
  position: absolute;
  bottom: 11px;
  right: 16px;
  @media (max-width: 576px) {
    position: relative;
    right: auto;
    bottom: auto;
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

const RatingWrapper = styled.div`
  margin-top: 5px;
`;

const initialState = {
  allBounties: null,
  loading: true,
  error: null,
};

const message = {
  work: false,
  release: false,
  completed: false,
  rating: false,
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
  bountyId: "",
};

const BountiesBase = ({ firebase, navigate }) => {
  const [provider, setProvider] = React.useState(null);
  const [state] = React.useContext(AppContext);
  const [State, setState] = React.useState({ ...initialState });
  const [profile, setProfile] = React.useState(false);
  const [rwrkId, setRwrkId] = React.useState(null);
  const [requestworkloader, setRequestWorkLoader] = React.useState(false);
  const [requestReleaseLoader, setRequestReleaseLoader] = React.useState(false);
  const [completeWorkLoader, setCompleteWorkLoader] = React.useState(false);
  const [contractAddress, setContractAddress] = React.useState();
  const [showcompleteModal, setShowcompleteModal] = React.useState(false);
  const [rateLoader, setRateLoader] = React.useState(false);
  const [ratingDiscriptionValue, setRatingDiscriptionValue] =
    React.useState("");
  const [showReleseModal, setShowReleseModal] = React.useState(false);
  const [message, setMessage] = React.useState({ ...message });
  const [showModal, setShowModal] = React.useState(false);
  const [bountyId, setBountyId] = React.useState();
  const [coustemerId, setCoustomerId] = React.useState();
  const [providerId, setProviderId] = React.useState();
  const [ratingValue, setRatingValue] = React.useState(0);
  const [ratingName, setRatingName] = React.useState("");
  const [requestToWork, setRequestToWork] = React.useState([
    { ...requestToworkDetails },
  ]);
  const [loader, setLoader] = React.useState(0);
  const [requestWorkRelease, setRequestWorkRelease] = React.useState(false);
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
                    cob_walletaddress: value.cob_walletaddress,
                    bountyId: bounty.cob_bountyid,
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

  const setSmartContractAddress = async (
    smartContractAddress,
    cob_walletaddress,
    requestToWorkId
  ) => {
    setShowModal(false);
    let contract = new ethers.Contract(
      smartContractAddress,
      abi,
      provider.getSigner()
    );
    try {
      const value = await contract.setProvider(cob_walletaddress);
      if (value) {
        bountRequestWorkAprroval(requestToWorkId);
      }
    } catch (error) {
      setRequestWorkLoader(false);
      console.log("error", error);
    }
  };

  const bountRequestWorkAprroval = async (requestToWorkId) => {
    await axios
      .patch(`${appConfig.apiBaseUrl}requestToWorks/${requestToWorkId}/approve`)
      .then((response) => {
        if (response.status === 200) {
          setRequestWorkRelease(true);
          setShowModal(true);
          setMessage((prevState) => ({
            ...prevState,
            work: true,
            release: false,
            completed: false,
            rating: false,
          }));
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

  const bountyAcceptHandler = async (
    requestToWorkId,
    cob_smartcontractaddress,
    cob_walletaddress
  ) => {
    setRwrkId(requestToWorkId);
    setRequestWorkLoader(true);
    setSmartContractAddress(
      cob_smartcontractaddress,
      cob_walletaddress,
      requestToWorkId
    );
  };

  const bountyReleaseCallHandler = async (requestToWorkId) => {
    axios
      .patch(`${appConfig.apiBaseUrl}requestToWorks/${requestToWorkId}/release`)
      .then((response) => {
        if (response.status === 200) {
          setShowModal(true);
          setMessage((prevState) => ({
            ...prevState,
            work: false,
            release: true,
            completed: false,
            rating: false,
          }));
          getCustomerBounties();
          setRequestReleaseLoader(false);
          console.log("response", response);
        }
      })
      .catch((error) => {
        setRequestReleaseLoader(false);
        console.log("error", error);
      });
  };

  const bountyReleaseHandler = async () => {
    setRequestReleaseLoader(true);
    setShowReleseModal(false);
    let contract = new ethers.Contract(
      contractAddress,
      abi,
      provider.getSigner()
    );
    console.log("contract", contract);
    try {
      const value = await contract.release();
      console.log("value", value);
      if (value) {
        bountyReleaseCallHandler(rwrkId);
      }
    } catch (error) {
      console.log("error", error);
      setRequestReleaseLoader(false);
    }
  };

  const bountystatusChangeHandler = async () => {
    const bountyStatus = "Completed";
    axios
      .patch(`${appConfig.apiBaseUrl}bounties/${bountyId}`, { bountyStatus })
      .then((response) => {
        console.log("response", response);
        setShowModal(true);
        setMessage((prevState) => ({
          ...prevState,
          work: false,
          release: false,
          completed: true,
          rating: false,
        }));
        setCompleteWorkLoader(false);
        getCustomerBounties();
      })
      .catch((error) => {
        setCompleteWorkLoader(false);
        console.log("error", error);
      });
  };

  const openReleaseModalHandler = (
    requestToWorkId,
    cob_smartcontractaddress
  ) => {
    setRwrkId(requestToWorkId);
    setContractAddress(cob_smartcontractaddress);
    setShowReleseModal(true);
  };

  const completeConfirmHandler = async (requestToWorkId) => {
    console.log("cob_smartcontractaddress", contractAddress);
    console.log("bountyId", bountyId);
    setShowcompleteModal(false);
    setCompleteWorkLoader(true);
    let contract = new ethers.Contract(
      contractAddress,
      abi,
      provider.getSigner()
    );
    console.log("contract", contract);
    try {
      const value = await contract.transferToProvider();
      if (value) {
        bountystatusChangeHandler();
      }
    } catch (error) {
      console.log("error", error);
      setCompleteWorkLoader(false);
    }
  };

  const openCompleteModalHandler = (
    requestToWorkId,
    cob_smartcontractaddress,
    bountyId,
    coustomer_id,
    privider_id
  ) => {
    setCoustomerId(coustomer_id);
    setProviderId(privider_id);
    setShowcompleteModal(true);
    setRwrkId(requestToWorkId);
    setContractAddress(cob_smartcontractaddress);
    setBountyId(bountyId);
  };

  const ratingChanged = (newRating) => {
    setRatingValue(newRating);
  };

  const bountyRatingHandler = () => {
    let data;
    setRateLoader(true);
    if (state.accountId === coustemerId) {
      data = {
        CustomerId: coustemerId,
        ProviderId: providerId,
        Name: ratingName,
        RatingType: "CustomerReviewOfProvider",
        Rating: ratingValue.toString(),
        BountyId: bountyId,
        Description: ratingDiscriptionValue,
      };
      axios
        .post(`${appConfig.apiBaseUrl}ratings/new`, data)
        .then((response) => {
          setRateLoader(false);
          console.log(response);
          setShowModal(true);
          setMessage((prevState) => ({
            ...prevState,
            work: false,
            release: false,
            completed: false,
            rating: true,
          }));
        })
        .catch((error) => {
          setRateLoader(false);
          setRateLoader(false);
          console.log(error);
        });
    }
  };

  const data = State.allBounties?.map((bounty, index) => (
    <Well key={index}>
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
        requestToWork.map((value, index) => {
          let imageUrl;
          const string2 = value.profilePicture;
          const string1 = "data:image/png;base64,";
          imageUrl = string1.concat(string2);
          if (value.Id === bounty["@odata.etag"]) {
            return (
              <RequestToWork key={index}>
                <h3>Request to work</h3>
                <div>
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
                      {bounty._cob_providerid_value === value.cob_providerId2 &&
                        bounty.cob_bountystatus !== 769020002 && (
                          <SelectedButton>
                            <AiFillStar />
                            Selected
                          </SelectedButton>
                        )}
                    </div>
                  </RequestToWorkIn>
                  {bounty.cob_bountystatus !== 769020002 ? (
                    bounty._cob_providerid_value === null ? (
                      <ButtonWrapper>
                        <Button
                          onPress={() => {
                            bountyAcceptHandler(
                              value.requestToWorkdId,
                              bounty.cob_smartcontractaddress,
                              value.cob_walletaddress
                            );
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
                            )}{" "}
                          Accept
                        </Button>
                        <Button variant="negative"> Reject </Button>
                      </ButtonWrapper>
                    ) : (
                      <>
                        <ButtonReleaseWrapper>
                          <Button
                            variant="negative"
                            onPress={() => {
                              openReleaseModalHandler(
                                value.requestToWorkdId,
                                bounty.cob_smartcontractaddress
                              );
                            }}
                          >
                            {" "}
                            {value.requestToWorkdId === rwrkId &&
                              requestReleaseLoader && (
                                <ProgressCircle
                                  aria-label="Loading…"
                                  isIndeterminate
                                />
                              )}{" "}
                            Release
                          </Button>
                          <Button
                            variant="cta"
                            onPress={() => {
                              openCompleteModalHandler(
                                value.requestToWorkdId,
                                bounty.cob_smartcontractaddress,
                                value.bountyId,
                                bounty._cob_customerid_value,
                                bounty._cob_providerid_value
                              );
                            }}
                          >
                            {" "}
                            {value.requestToWorkdId === rwrkId &&
                              completeWorkLoader && (
                                <ProgressCircle
                                  aria-label="Loading…"
                                  isIndeterminate
                                />
                              )}{" "}
                            Complete
                          </Button>
                        </ButtonReleaseWrapper>
                      </>
                    )
                  ) : (
                    <SelectedButton>
                      <AiFillStar />
                      Awarded
                    </SelectedButton>
                  )}
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
          isPrimaryActionDisabled={true}
          title={
            message.work
              ? "success"
              : message.release
              ? "success"
              : message.completed
              ? "Bounty completed successfully"
              : message.rating
              ? "success"
              : ""
          }
        >
          {message.work
            ? "Bounty request accepted"
            : message.release
            ? "Bounty released successfully"
            : message.rating
            ? "Bounty rated successfully"
            : ""}
          {message.completed && (
            <Content>
              <Text>Rate this bounty now?</Text>
              <ItemWrapperRating>
                <ReactStars
                  count={5}
                  onChange={(newRating) => ratingChanged(newRating)}
                  size={24}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />
                <TextField placeholder="Name" onChange={setRatingName} />
                <TextArea
                  placeholder="comment"
                  onChange={setRatingDiscriptionValue}
                />
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    variant="negative"
                    onPress={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="cta" onPress={() => bountyRatingHandler()}>
                    submit
                  </Button>
                </div>
              </ItemWrapperRating>
            </Content>
          )}

          {!message.completed && (
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button variant="secondary" onPress={() => setShowModal(false)}>
                ok
              </Button>
            </div>
          )}
          {rateLoader && (
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgb(0 0 0 / 38%)",
              }}
            >
              <ProgressCircle aria-label="Loading…" isIndeterminate />
            </div>
          )}
        </AlertDialog>
      </DialogTrigger>
      <DialogTrigger isOpen={showcompleteModal}>
        <></>
        <Dialog>
          <Heading>Complete Work </Heading>
          <Divider />
          <Content>
            <Text>Do you want to complete and transfer fund to provider?</Text>
          </Content>
          <ButtonGroup>
            <Button
              variant="secondary"
              onPress={() => {
                setShowcompleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="cta" onPress={completeConfirmHandler}>
              Confirm
            </Button>
          </ButtonGroup>
        </Dialog>
      </DialogTrigger>
      <DialogTrigger isOpen={showReleseModal}>
        <></>
        <Dialog>
          <Heading> Release bounty</Heading>

          <Divider />
          <Content>
            <Text>Do you want to release the bounty?</Text>
          </Content>
          <ButtonGroup>
            <Button
              variant="secondary"
              onPress={() => {
                setShowReleseModal(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="cta" onPress={bountyReleaseHandler}>
              Confirm
            </Button>
          </ButtonGroup>
        </Dialog>
      </DialogTrigger>
    </div>
  );
};

const MyCreatedBounties = compose(withRouter, withFirebase)(BountiesBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(MyCreatedBounties);
