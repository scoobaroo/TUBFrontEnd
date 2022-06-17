import { useLocation } from "react-router-dom";
import appConfig from "webpack-config-loader!../../app-config.js";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import {
  Heading,
  TextField,
  Button,
  ProgressCircle,
  AlertDialog,
  DialogTrigger,
  ActionButton,
  Dialog,
  Divider,
  Content,
  ButtonGroup,
  Link,
  Flex,
  Form,
  Text,
  TextArea,
  ComboBox,
  Item,
  Footer,
} from "@adobe/react-spectrum";
import { ethers, getDefaultProvider, utils } from "ethers";
import styled from "styled-components";
import React from "react";
import axios from "axios";
import abi from "../../abi/Bounty.json";
import { AppContext } from "../../context";
import {
  BlobServiceClient,
  ContainerSASPermissions,
} from "@azure/storage-blob";
import { FaFileAlt } from "react-icons/fa";
import { useMetaMask } from "metamask-react";

const BountyWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 16px;
  margin: 16px;
`;

const BountyDeteilsWrapper = styled.div`
  border: 1px #4f4a4a solid;
  border-radius: 5px;
  padding: 16px;
  & img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    @media (max-width: 576px) {
      margin-bottom: 10px;
    }
  }
`;

const RequestToWork = styled.div`
  position: relative;
  padding: 15px;
  margin-top: 10px;
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
const ImageWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-left: 10px;
`;
const ImageWrapperReview = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  & img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }
`;

const ItemWrapper = styled.div`
  margin: 10px;
`;
const ItemWrapperRating = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: #222222;
  width: 45%;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    width: 100%;
  }
  & h3 {
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px dashed #535353;
    padding-bottom: 7px;
    margin-bottom: 10px;
  }

  & button {
    width: 110px;
    margin: 12px 0 0 auto;
  }
  & input {
    margin-bottom: 10px;
  }
`;

const ItemWrapperReview = styled.div`
  padding: 10px;
  border-radius: 10px;
  background: #333333;
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  @media (max-width: 992px) {
    flex-wrap: wrap;
  }
`;

const Wrapper = styled.div`
  cursor: pointer;
  margin: 10px;
  background-color: #222222;
  border-radius: 10px;
  padding: 20px;
  width: 50%;
  @media (max-width: 992px) {
    width: 100%;
    margin: 10px 0;
  }
  & h4 {
    border-bottom: 1px solid #434242;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
`;

const ButtonWrapperTwo = styled.div`
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

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 35px;
  width: 100%;
  margin-left: 10px;
  & button {
    margin-right: 10px;
  }
  @media (max-width: 576px) {
    flex-direction: column;
    justify-content: center;
  }
  & button {
    @media (max-width: 576px) {
      margin-bottom: 10px;
    }
  }
`;

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  & > div {
    display: flex;
    align-items: center;
    padding: 5px 15px;
    background: #2b2b2b;
    border-radius: 25px;
    margin: 0 12px 12px 0;
    color: #fff;
    &:hover {
      background: #515151;
    }
    & svg {
      margin-right: 7px;
    }
    & a {
      color: #fff;
      text-decoration: none;
      &:hover {
        color: #fff;
        text-decoration: none;
      }
    }
  }
`;

const ModalWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Modal = ({
  onMessageHandler,
  register,
  modal,
  closeModal,
  types,
  metaMaskAddresHandler,
  value,
  addressEditHandler,
  type,
}) => (
  <ModalWrapper>
    <DialogTrigger isOpen={modal}>
      <ButtonWrapper>
        {/* <ActionButton onPress={openModal}>
          <FaPlus />
        </ActionButton> */}
      </ButtonWrapper>
      <Dialog>
        <Heading>
          <Flex alignItems="center" gap="size-100">
            <Text>Request To Work</Text>
          </Flex>
        </Heading>
        <Divider />
        <Content>
          <Form>
            <TextArea
              label="Message"
              name="message"
              onChange={onMessageHandler}
            />
            <ComboBox
              label="Type"
              isReadOnly={true}
              inputValue={type}
            ></ComboBox>
            <TextField
              onChange={addressEditHandler}
              value={value}
              label="Aaccount Address"
              name="amount"
            />
            <ButtonGroup>
              <Button variant="secondary" onPress={metaMaskAddresHandler}>
                Populate Aaccount Address
              </Button>
            </ButtonGroup>
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
        <Divider />
        <Footer>
          <Flex alignItems="center" gap="size-100">
            <p
              style={{
                fontStyle: "italic",
                fontWeight: "lighter",
                fontSize: "80%",
              }}
            >
              * Please make sure wallet address matches the chain the bounty was
              created on. This wallet address is used for your payment, and if
              it is incorrect will result in irrecoverable loss of funds.
            </p>
          </Flex>
        </Footer>
      </Dialog>
    </DialogTrigger>
  </ModalWrapper>
);

const BountyDetails = () => {
  const instialState = {
    categoryName: "",
    subCatergoryName: "",
    bountyamout: "",
    bountyStatus: "",
    SmartContractAddress: "",
    topics: [],
    loading: true,
    showUploadModal: false,
    files: [],
    customerId: "",
    providerId: "",
    rating: [],
    reqToWork: [],
  };
  const intialMessage = {
    cancel: false,
    getBounty: false,
    image: false,
    requestWork: false,
  };

  const requestToWorkState = {
    ERC20Chain: "",
    Message: "",
    BountyId: "",
    ProviderId: "",
    WalletAddress: "",
  };

  const requestToworkDetails = {
    first_name: "",
    last_name: "",
    email: "",
    profilePicture: "",
    linkedIn: "",
    github: "",
    telephone: "",
    education: [],
    certification: [],
    profilePicture: "",
  };

  const reqtoWorkProvider = {
    first_name: "",
    last_name: "",
    email: "",
    profilePicture: "",
    linkedIn: "",
    github: "",
    telephone: "",
    education: [],
    certification: [],
    profilePicture: "",
    message: "",
  };

  const providerDetails = {
    first_name: "",
    last_name: "",
    email: "",
    profilePicture: "",
    linkedIn: "",
    github: "",
    telephone: "",
    education: [],
    certification: [],
    profilePicture: "",
  };

  const location = useLocation();
  const bountyId = location.state.BountyId;

  const [bountyDetails, setBountyDetails] = React.useState({ ...instialState });
  const [userProviderDetails, setUserProviderDetails] = React.useState({
    ...providerDetails,
  });
  const [providerRateVAlue, setProviderRateValue] = React.useState(0);
  const [customerRateValue, setCustomerRateValue] = React.useState(0);
  const [providerRateDiscription, setProviderRateDiscription] =
    React.useState("");
  const [customerRateDiscription, setCustomerRateDiscription] =
    React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [amount, setAmount] = React.useState();
  const [bountyAmount, setBountyAmount] = React.useState();
  const [active, setActive] = React.useState();
  const [provider, setProvider] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [confirmCancel, setconfirmCancel] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [message, setMessage] = React.useState({ ...intialMessage });
  const [ratingName, setRatingName] = React.useState("");
  const [userDetatils, setUserDetails] = React.useState({
    ...requestToworkDetails,
  });
  const [reqToWorkPovider, setReqToWorkProvider] = React.useState({
    ...reqtoWorkProvider,
  });
  const [globalState] = React.useContext(AppContext);
  const [ImageBloburls, setImageBloburls] = React.useState([]);
  const inputFileRef = React.useRef(null);
  const [imageLoader, setImageLoader] = React.useState(false);
  const sasToken = appConfig.azure.sasToken;
  const storageAccountName = appConfig.azure.storageAccountName;
  const containerName = `bounty-${bountyId}`;
  const [showurl, setShowurl] = React.useState(false);
  const [types, setTypes] = React.useState();
  const [showModalTwo, setShowModalTwo] = React.useState(false);
  const [ratingValue, setRatingValue] = React.useState(0);
  const [ratingLoader, setRatingLoader] = React.useState(false);
  const [requestToWorkHandler, setRequestToWorkHandler] = React.useState({
    ...requestToWorkState,
  });
  const [imageUrl, setImageUrl] = React.useState("");
  const { account, ethereum } = useMetaMask();
  const [userName, setUserName] = React.useState("");
  const [ratingDiscriptionValue, setRatingDiscriptionValue] =
    React.useState("");
  const [reviewconditon, setReviewconditon] = React.useState(true);

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);
  const navigate = useNavigate();

  React.useEffect(() => {
    setBountyDetails((prevState) => ({
      ...prevState,
      loading: true,
    }));
    loadBountyDetails();
  }, [bountyId]);

  React.useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    getBlobsInContainer(containerClient);
    setRequestToWorkHandler((prevState) => ({
      ...prevState,
      ERC20Chain: "COB_erc20",
    }));
  }, []);

  React.useEffect(() => {
    const value = globalState.RequestWork;
    setTypes(value?.map((item) => item.Label.UserLocalizedLabel));
  }, []);

  React.useEffect(() => {
    loadProfileDetails();
    loadProviderDetails();
  }, [bountyDetails.customerId]);

  React.useEffect(() => {
    if (bountyDetails.reqToWork.length > 0) {
      let id;
      bountyDetails.reqToWork.map((item) => {
        id = item.providerId;
      });

      loadReqWorkProviderDatails(id);
    }
  }, [bountyDetails.reqToWork]);

  const loadProfileDetails = () => {
    console.log("accontId", bountyDetails.customerId);
    axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${bountyDetails.customerId}`)
      .then((res) => {
        console.log("coustomer datataaaa", res);
        let imageUrl;
        if (res.data.cob_profilepicture !== "") {
          const string2 = res.data.cob_profilepicture;
          const string1 = "data:image/png;base64,";
          imageUrl = string1.concat(string2);
          setImageUrl(imageUrl);
          setUserName(res.data.cob_firstname + " " + res.data.cob_lastname);
          setUserDetails((prevState) => ({
            ...prevState,
            first_name: res.data.cob_firstname,
            last_name: res.data.cob_lastname,
            email: res.data.emailaddress1,
            profilePicture: imageUrl,
            linkedIn: res.data.cob_linkedinurl,
            github: res.data.cob_githuburl,
            telephone: res.data.telephone1,
            education: res.data.cob_Education_providerid_Account,
            certification: res.data.cob_Certification_providerid_Account,
          }));
        } else {
          imageUrl =
            "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadProviderDetails = () => {
    axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${bountyDetails.providerId}`)
      .then((res) => {
        console.log("provider datataaaa", res);
        let imageUrl;
        if (res.data.cob_profilepicture !== "") {
          const string2 = res.data.cob_profilepicture;
          const string1 = "data:image/png;base64,";
          imageUrl = string1.concat(string2);
          setUserProviderDetails((prevState) => ({
            ...prevState,
            first_name: res.data.cob_firstname,
            last_name: res.data.cob_lastname,
            email: res.data.emailaddress1,
            profilePicture: imageUrl,
            linkedIn: res.data.cob_linkedinurl,
            github: res.data.cob_githuburl,
            telephone: res.data.telephone1,
            education: res.data.cob_Education_providerid_Account,
            certification: res.data.cob_Certification_providerid_Account,
          }));
        } else {
          imageUrl =
            "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadReqWorkProviderDatails = (id) => {
    setLoader(true);
    axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${id}`)
      .then((res) => {
        setLoader(false);
        console.log("provider datataaaa", res);
        let imageUrl;
        if (res.data.cob_profilepicture !== "") {
          const string2 = res.data.cob_profilepicture;
          const string1 = "data:image/png;base64,";
          imageUrl = string1.concat(string2);
          setReqToWorkProvider((prevState) => ({
            ...prevState,
            first_name: res.data.cob_firstname,
            last_name: res.data.cob_lastname,
            email: res.data.emailaddress1,
            profilePicture: imageUrl,
            linkedIn: res.data.cob_linkedinurl,
            github: res.data.cob_githuburl,
            telephone: res.data.telephone1,
            education: res.data.cob_Education_providerid_Account,
            certification: res.data.cob_Certification_providerid_Account,
            message: res.data.cob_message,
          }));
        } else {
          imageUrl =
            "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true";
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const loadBountyDetails = async () => {
    let status;
    let custemerId;
    let providerId;
    let rating;
    await axios
      .get(`${appConfig.apiBaseUrl}bounties/${bountyId}`)
      .then((response) => {
        console.log("dsfdsfdsfsdf", response.data);
        setBountyDetails((prevState) => ({
          ...prevState,
          categoryName: response.data?.CategoryId?.categoryName,
          subCatergoryName: response.data?.SubCategoryId?.subCategoryName,
          bountyamout: response.data?.BountyAmount,
          bountyStatus: response.data?.BountyStatus,
          smartContractAddress: response.data?.SmartContractAddress,
          topics: response.data?.Topics,
          customerId: response.data?.CustomerId?.Id,
          providerId: response.data?.ProviderId.Id || response.data?.ProviderId,
          loading: false,
          rating: response.data?.Ratings,
          reqToWork: response.data?.RequestToWorks,
        }));
        status = response.data?.BountyStatus;
        custemerId = response.data?.CustomerId?.Id;
        providerId = response.data?.ProviderId?.Id;
        rating = response.data?.Ratings;

        rateShowHandler(status, custemerId, providerId, rating);
        rateVAlueHandler(rating);
      })
      .catch((error) => {
        console.log(error);
        setBountyDetails((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  const uploadFiles = async () => {};

  const filesSelected = (e) => {
    debugger;
    setBountyDetails((prevState) => ({
      ...prevState,
      files: e.currentTarget.files,
    }));
  };

  const amountOnChange = (value) => {
    console.log("AMT" + value);
    setAmount(value);
  };
  const increaseBounty = async () => {
    let contract = new ethers.Contract(
      bountyDetails.smartContractAddress,
      abi,
      provider.getSigner()
    );
    contract.attach(provider.getSigner().getAddress());
    const options = { value: ethers.utils.parseEther(amount) };
    await contract.increaseBounty(options);
  };

  const getBounty = async () => {
    let contract = new ethers.Contract(
      bountyDetails.smartContractAddress,
      abi,
      provider.getSigner()
    );
    // contract.connect(provider.getSigner());
    let bountyAmount = await contract.getBounty();
    let amount = parseInt(bountyAmount._hex, 16).toString();
    bountyAmount = ethers.utils.formatEther(amount);
    setBountyAmount(bountyAmount);
  };

  const cancel = async () => {
    setShowModal(false);
    let contract = new ethers.Contract(
      bountyDetails.smartContractAddress,
      abi,
      provider.getSigner()
    );
    let result = await contract.cancel();
  };

  const getStatus = async () => {
    let contract = new ethers.Contract(
      bountyDetails.smartContractAddress,
      abi,
      provider.getSigner()
    );
    // let fact = await contract.deployed();
    console.log(contract);
    let status = await contract.getStatus();
    console.log(status);
    setActive(status);
  };
  const cancelHandler = async () => {
    try {
      await cancel();
      setShowSuccess(true);
      setMessage((prevState) => ({
        ...prevState,
        cancel: true,
        getBounty: false,
        image: false,
        requestWork: false,
      }));
    } catch (error) {
      setShowError(true);
      setMessage((prevState) => ({
        ...prevState,
        cancel: true,
        getBounty: false,
        image: false,
        requestWork: false,
      }));
    }
  };

  const getBoundyHandler = async () => {
    try {
      await getBounty();
      setShowSuccess(true);
      setMessage((prevState) => ({
        ...prevState,
        getBounty: true,
        cancel: false,
        image: false,
        requestWork: false,
      }));
    } catch (error) {
      setShowError(true);
      setMessage((prevState) => ({
        ...prevState,
        getBounty: true,
        cancel: false,
        image: false,
        requestWork: false,
      }));
      console.log(error);
    }
  };

  const ImageHandler = () => {
    inputFileRef.current.click();
  };

  const ImageUploadHandler = (e) => {
    console.log(e.target.files);
    let file = e.target.files[0];
    console.log(file);
    uploadFileToBlob(file);
    setImageLoader(true);
  };

  const uploadFileToBlob = async (file) => {
    if (!file) return [];

    await containerClient.createIfNotExists({
      access: "container",
    });

    // upload file
    await createBlobInContainer(containerClient, file);
    setMessage((prevState) => ({
      ...prevState,
      getBounty: false,
      cancel: false,
      image: true,
    }));
    setShowSuccess(true);
    setImageLoader(false);
    // get list of blobs in container
    return getBlobsInContainer(containerClient);
  };

  const createBlobInContainer = async (containerClient, file) => {
    // create blobClient for container
    const blobClient = containerClient.getBlockBlobClient(file.name);

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    // upload file
    await blobClient.uploadBrowserData(file, options);
    await blobClient.setMetadata({ UserName: "taskunblock" });
  };

  const getBlobsInContainer = async (containerClient) => {
    const returnedBlobUrls = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      // if image is public, just construct URL
      returnedBlobUrls.push({
        name: blob.name,
        url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`,
      });
    }
    setShowurl(true);
    setImageBloburls(returnedBlobUrls);
    return returnedBlobUrls;
  };

  const openModal = () => {
    setShowModalTwo(true);
  };

  const closeModal = () => {
    setShowModalTwo(false);
  };

  const requestToWorkSubmit = async () => {
    setLoader(true);
    console.log(requestToWorkHandler);
    axios
      .post(`${appConfig.apiBaseUrl}requestToWorks/new`, requestToWorkHandler)
      .then((response) => {
        console.log(response);
        setShowModalTwo(false);
        setShowSuccess(true);
        setLoader(false);
        setMessage((prevState) => ({
          ...prevState,
          getBounty: false,
          cancel: false,
          image: false,
          requestWork: true,
        }));
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setLoader(false);
        setMessage((prevState) => ({
          ...prevState,
          getBounty: false,
          cancel: false,
          image: false,
          requestWork: true,
        }));
      });
  };

  const onMessageHandler = (message) => {
    setRequestToWorkHandler((prevState) => ({
      ...prevState,
      Message: message,
      BountyId: bountyId,
      ProviderId: globalState.accountId,
      ERC20Chain: "COB_erc20",
    }));
  };

  const metaMaskAddresHandler = () => {
    setRequestToWorkHandler((prevState) => ({
      ...prevState,
      WalletAddress: account,
      ERC20Chain: "COB_erc20",
    }));
  };
  const addressEditHandler = (e) => {
    setRequestToWorkHandler((prevState) => ({
      ...prevState,
      WalletAddress: e,
      ERC20Chain: "COB_erc20",
    }));
  };

  const bountRatingHandler = (bounty) => {
    setRatingLoader(true);
    let data;
    if (globalState.accountId === bounty.customerId) {
      data = {
        CustomerId: bounty.customerId,
        ProviderId: bounty.providerId,
        Name: ratingName,
        RatingType: "CustomerReviewOfProvider",
        Rating: ratingValue.toString(),
        BountyId: bountyId,
        Description: ratingDiscriptionValue,
      };
      axios
        .post(`${appConfig.apiBaseUrl}ratings/new`, data)
        .then((response) => {
          setRatingLoader(false);
          loadBountyDetails();
          console.log(response);
        })
        .catch((error) => {
          setRatingLoader(false);
          console.log(error);
        });
    } else {
      data = {
        CustomerId: bounty.customerId,
        ProviderId: bounty.providerId,
        Name: ratingName,
        RatingType: "",
        Rating: ratingValue.toString(),
        BountyId: bountyId,
        Description: ratingDiscriptionValue,
      };
      axios
        .post(`${appConfig.apiBaseUrl}ratings/new`, data)
        .then((response) => {
          loadBountyDetails();
          setRatingLoader(false);
          console.log(response);
        })
        .catch((error) => {
          setRatingLoader(false);
          console.log(error);
        });
    }
  };

  const ProfileViewer = () => {
    navigate("/requesttoworkprofile", {
      state: {
        firstName: userDetatils.first_name,
        lastName: userDetatils.last_name,
        Email: userDetatils.email,
        Url: userDetatils.profilePicture,
        linkedIn: userDetatils.linkedIn,
        Github: userDetatils.github,
        Telephone: userDetatils.telephone,
        Certification: userDetatils.certification,
        Education: userDetatils.education,
      },
    });
  };

  const providerProfileViewer = () => {
    navigate("/requesttoworkprofile", {
      state: {
        firstName: userProviderDetails.first_name,
        lastName: userProviderDetails.last_name,
        Email: userProviderDetails.email,
        Url: userProviderDetails.profilePicture,
        linkedIn: userProviderDetails.linkedIn,
        Github: userProviderDetails.github,
        Telephone: userProviderDetails.telephone,
        Certification: userProviderDetails.certification,
        Education: userProviderDetails.education,
      },
    });
  };

  const reqproviderProfileViewer = () => {
    navigate("/requesttoworkprofile", {
      state: {
        firstName: reqToWorkPovider.first_name,
        lastName: reqToWorkPovider.last_name,
        Email: reqToWorkPovider.email,
        Url: reqToWorkPovider.profilePicture,
        linkedIn: reqToWorkPovider.linkedIn,
        Github: reqToWorkPovider.github,
        Telephone: reqToWorkPovider.telephone,
        Certification: reqToWorkPovider.certification,
        Education: reqToWorkPovider.education,
      },
    });
  };

  const rateShowHandler = (status, customerId, providerId, rating) => {
    if (status === "Completed") {
      if (customerId === globalState.accountId) {
        let value = rating.findIndex(
          (i) => i.ratingType === "Customer Review of Provider"
        );
        if (value >= 0) {
          setReviewconditon(false);
        }
      } else if (providerId === globalState.accountId) {
        let vlue2 = rating.findIndex(
          (i) => i.ratingType === "Provider Review of Customer"
        );
        if (vlue2 >= 0) {
          setReviewconditon(false);
        }
      } else if (
        customerId !== globalState.accountId &&
        providerId !== globalState.accountId
      ) {
        setReviewconditon(false);
      }
    }
  };

  const rateVAlueHandler = (rating) => {
    if (rating.length !== 0) {
      rating.filter((i) => {
        if (i.ratingType === "Customer Review of Provider") {
          setCustomerRateValue(i.rating);
          setCustomerRateDiscription(i.description);
        } else if (i.ratingType === "Provider Review of Customer") {
          setProviderRateValue(i.rating);
          setProviderRateDiscription(i.description);
        }
      });
    }
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

  const bountyAcceptHandler = async (
    requestToWorkId,
    cob_smartcontractaddress,
    cob_walletaddress
  ) => {
    setSmartContractAddress(
      cob_smartcontractaddress,
      cob_walletaddress,
      requestToWorkId
    );
  };

  const openCompleteModalHandler = (
    cob_smartcontractaddress,
    bountyId,
    coustomer_id,
    privider_id
  ) => {};

  const openReleaseModalHandler = (cob_smartcontractaddress) => {
    setContractAddress(cob_smartcontractaddress);
  };

  const ratingChanged = (newRating) => {
    console.log(newRating);
    setRatingValue(newRating);
  };

  if (bountyDetails.loading || loader || imageUrl === "" || userName === "") {
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
    <BountyWrapper>
      <h2>#Bounty Details</h2>
      <BountyDeteilsWrapper>
        <ItemWrapper>
          <Heading>
            <span style={{ width: "150px", display: "inline-block" }}>
              Category
            </span>
            : {bountyDetails.categoryName}
          </Heading>
        </ItemWrapper>
        <ItemWrapper>
          <Heading>
            <span style={{ width: "150px", display: "inline-block" }}>
              SubCategory
            </span>
            : {bountyDetails.subCatergoryName}
          </Heading>
        </ItemWrapper>
        {bountyDetails.topics.length != 0 && (
          <ItemWrapper>
            <Heading>
              <span style={{ width: "150px", display: "inline-block" }}>
                Topics
              </span>
              :{" "}
              {bountyDetails.topics?.map(
                (topic, key) =>
                  `${topic.topicName}${
                    key !== bountyDetails.topics.length - 1 ? "," : ""
                  } `
              )}
            </Heading>
          </ItemWrapper>
        )}

        <ItemWrapper>
          <Heading>
            <span style={{ width: "150px", display: "inline-block" }}>
              Bounty Amount
            </span>
            : {bountyDetails.bountyamout}
          </Heading>
        </ItemWrapper>
        <ItemWrapper>
          <Heading>
            <span style={{ width: "150px", display: "inline-block" }}>
              Bounty Status
            </span>
            : {bountyDetails.bountyStatus}
          </Heading>
        </ItemWrapper>

        <div
          onClick={() => ProfileViewer()}
          style={{ display: "flex", cursor: "pointer", margin: "10px" }}
        >
          <Heading>
            <span style={{ width: "150px", display: "inline-block" }}>
              Customer
            </span>
            :
          </Heading>
          <ImageWrapper review={false}>
            <img src={imageUrl} alt="profile" />
            <Heading>{userName}</Heading>
          </ImageWrapper>
        </div>
        {userProviderDetails.email && (
          <div style={{ display: "flex", margin: "10px" }}>
            <Heading>
              <span style={{ width: "150px", display: "inline-block" }}>
                Provider
              </span>
              :
            </Heading>
            <ImageWrapper
              review={false}
              onClick={() => providerProfileViewer()}
            >
              <img src={userProviderDetails.profilePicture} alt="profile" />
              <Heading>
                {userProviderDetails.first_name +
                  " " +
                  userProviderDetails.last_name}
              </Heading>
            </ImageWrapper>
          </div>
        )}

        <a
          style={{ textDecoration: "none" }}
          href={`https://rinkeby.etherscan.io/address/${bountyDetails.smartContractAddress}`}
          target="_blank"
        >
          <Button variant="negative">View on blockchain explorer</Button>
        </a>

        {bountyDetails.customerId !== globalState.accountId &&
          bountyDetails.bountyStatus === "Active" && (
            <>
              <Button onPress={openModal} variant="negative">
                Request To Work
              </Button>
              <Modal
                modal={showModalTwo}
                register={requestToWorkSubmit}
                closeModal={closeModal}
                onMessageHandler={onMessageHandler}
                types={types}
                metaMaskAddresHandler={metaMaskAddresHandler}
                value={requestToWorkHandler.WalletAddress}
                addressEditHandler={addressEditHandler}
                type={requestToWorkHandler.ERC20Chain}
              />
            </>
          )}

        {bountyDetails.customerId == globalState.accountId ? (
          <>
            {bountyDetails.bountyStatus !== "Completed" && (
              <ItemWrapper>
                <TextField
                  label="Amount to Increase"
                  value={amount}
                  onChange={amountOnChange}
                >
                  Amount to Increase
                </TextField>
                <Button
                  marginTop={30}
                  marginStart={12}
                  onPress={() => increaseBounty(parseInt(amount))}
                  variant="cta"
                >
                  Increase Bounty
                </Button>
              </ItemWrapper>
            )}

            <ButtonWrapper>
              {bountyDetails.bountyStatus !== "Completed" && (
                <Button onPress={() => setShowModal(true)} variant="negative">
                  Cancel
                </Button>
              )}

              <input
                ref={inputFileRef}
                style={{ display: "none" }}
                onChange={ImageUploadHandler}
                type="file"
              />

              <Button onPress={getBoundyHandler} variant="negative">
                Get Bounty
              </Button>
              {bountyDetails.bountyStatus !== "Completed" &&
                (imageLoader ? (
                  <ProgressCircle aria-label="Loading…" isIndeterminate />
                ) : (
                  <Button variant="negative" onPress={ImageHandler}>
                    Upload Related Files
                  </Button>
                ))}

              <Button
                onPress={async () => await getStatus()}
                variant="negative"
              >
                Get Status
              </Button>
            </ButtonWrapper>
          </>
        ) : null}
        {bountyDetails.bountyStatus !== "Completed" &&
        bountyDetails.reqToWork.length > 0 &&
        bountyDetails.customerId == globalState.accountId
          ? bountyDetails.reqToWork.map((reqToWork, index) => (
              <RequestToWork>
                <h3>Request to work</h3>
                <RequestToWorkIn>
                  <img
                    src={reqToWorkPovider.profilePicture}
                    onClick={() => reqproviderProfileViewer()}
                  />
                  <div>
                    <div>
                      {reqToWorkPovider.first_name +
                        " " +
                        reqToWorkPovider.last_name}
                    </div>
                    <div>{reqToWorkPovider.email}</div>
                    <div>{reqToWorkPovider.message}</div>
                  </div>
                </RequestToWorkIn>
                {bountyDetails.bountyStatus !== "Completed" ? (
                  bountyDetails.providerId === null ? (
                    <ButtonWrapperTwo>
                      <Button
                        onPress={() => {
                          bountyAcceptHandler(
                            bountyDetails.SmartContractAddress,
                            reqToWork.cob_walletaddress
                          );
                        }}
                        end
                        variant="cta"
                      >
                        {/* {value.requestToWorkdId === rwrkId &&
                        requestworkloader && (
                          <ProgressCircle
                            aria-label="Loading…"
                            isIndeterminate
                          />
                        )}{" "} */}
                        Accept
                      </Button>
                      <Button variant="negative"> Reject </Button>
                    </ButtonWrapperTwo>
                  ) : (
                    <>
                      <ButtonReleaseWrapper>
                        <Button
                          variant="negative"
                          onPress={() => {
                            openReleaseModalHandler(
                              bountyDetails.SmartContractAddress
                            );
                          }}
                        >
                          {/* {" "}
                        {value.requestToWorkdId === rwrkId &&
                          requestReleaseLoader && (
                            <ProgressCircle
                              aria-label="Loading…"
                              isIndeterminate
                            />
                          )}{" "} */}
                          Release
                        </Button>
                        <Button
                          variant="cta"
                          onPress={() => {
                            openCompleteModalHandler(
                              bountyDetails.SmartContractAddress,
                              bountyId,
                              bountyDetails.customerId,
                              bountyDetails.providerId
                            );
                          }}
                        >
                          {/* {" "}
                        {value.requestToWorkdId === rwrkId &&
                          completeWorkLoader && (
                            <ProgressCircle
                              aria-label="Loading…"
                              isIndeterminate
                            />
                          )}{" "} */}
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
              </RequestToWork>
            ))
          : bountyDetails.providerId === globalState.accountId &&
            bountyDetails.bountyStatus === "In Progress" && (
              <RequestToWork>
                <h3>Request to work</h3>
                <RequestToWorkIn>
                  <img
                    src={reqToWorkPovider.profilePicture}
                    onClick={() => reqproviderProfileViewer()}
                  />
                  <div>
                    <div>
                      {reqToWorkPovider.first_name +
                        " " +
                        reqToWorkPovider.last_name}
                    </div>
                    <div>{reqToWorkPovider.email}</div>
                    <div>{reqToWorkPovider.message}</div>
                  </div>
                </RequestToWorkIn>
                <ButtonWrapperTwo>
                  <Button>Mark as complete</Button>
                </ButtonWrapperTwo>
              </RequestToWork>
            )}
      </BountyDeteilsWrapper>
      {
        // bountyDetails.bountyStatus !== "Completed" &&
        <div>
          <h2>#Related Files</h2>
          <FileWrapper>
            {showurl
              ? ImageBloburls.map((blob, key) => (
                  <ItemWrapper>
                    <FaFileAlt />
                    <Link>
                      <a href={`${blob.url}`} target="_blank">
                        {blob.name}
                      </a>
                    </Link>
                  </ItemWrapper>
                ))
              : null}
          </FileWrapper>
        </div>
      }

      {bountyDetails.bountyStatus === "Completed" && reviewconditon && (
        <ItemWrapperRating>
          <h3>Review</h3>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <ReactStars
              count={5}
              onChange={(newRating) => ratingChanged(newRating)}
              size={26}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
            <TextField
              placeholder="Tittle"
              width={"100%"}
              onChange={setRatingName}
            />
            <TextArea
              placeholder="Comment"
              width={"100%"}
              onChange={setRatingDiscriptionValue}
            />
            <Button onPress={() => bountRatingHandler(bountyDetails)}>
              {ratingLoader && (
                <div>
                  {" "}
                  <ProgressCircle aria-label="Loading…" isIndeterminate />
                </div>
              )}
              submit
            </Button>
          </div>
        </ItemWrapperRating>
      )}

      {bountyDetails.bountyStatus === "Completed" &&
        (customerRateDiscription || providerRateDiscription) && (
          <ItemWrapperReview>
            {customerRateDiscription && (
              <Wrapper>
                <h4>Customer Review</h4>

                <ImageWrapperReview review={true}>
                  <img src={imageUrl} alt="profile" />
                  <Heading>{userName}</Heading>
                </ImageWrapperReview>

                <ReactStars
                  count={5}
                  value={customerRateValue}
                  edit={false}
                  size={26}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />

                {customerRateDiscription}
              </Wrapper>
            )}{" "}
            {providerRateDiscription && (
              <Wrapper>
                <h4>Provider Review</h4>

                <ImageWrapperReview
                  review={true}
                  onClick={() => providerProfileViewer()}
                >
                  <img src={userProviderDetails.profilePicture} alt="profile" />
                  <Heading>
                    {userProviderDetails.first_name +
                      " " +
                      userProviderDetails.last_name}
                  </Heading>
                </ImageWrapperReview>
                <ReactStars
                  count={5}
                  value={providerRateVAlue}
                  edit={false}
                  size={26}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />

                {providerRateDiscription}
              </Wrapper>
            )}
          </ItemWrapperReview>
        )}

      <DialogTrigger isOpen={showModal}>
        <></>
        <AlertDialog
          variant="confirmation"
          title="Confirmation"
          primaryActionLabel="Confirm"
          cancelLabel="Cancel"
          autoFocusButton="primary"
          onCancel={() => setShowModal(false)}
          onPrimaryAction={() => cancelHandler()}
        >
          Are you sure want to canel this bounty
        </AlertDialog>
      </DialogTrigger>
      <DialogTrigger isOpen={showSuccess}>
        <></>
        <AlertDialog
          title={
            message.cancel
              ? "Cancel Success"
              : message.image
              ? "success"
              : message.requestWork
              ? "Success"
              : "Get Bounty Success"
          }
          variant="information"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowSuccess(false)}
        >
          {message.cancel
            ? "Bounty cancelled successfully"
            : message.image
            ? "image uploaded successfully"
            : message.requestWork
            ? "Request to Work submitted successfully"
            : "Bounty got successfully"}
        </AlertDialog>
      </DialogTrigger>
      <DialogTrigger isOpen={showError}>
        <></>
        <AlertDialog
          title="Failed"
          variant="error"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowError(false)}
        >
          {message.getBounty
            ? "Bounty not found"
            : message.requestWork
            ? "Failed to submit request"
            : "Failed to cancel bounty."}
        </AlertDialog>
      </DialogTrigger>
    </BountyWrapper>
  );
};

export default BountyDetails;
