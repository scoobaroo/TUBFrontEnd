import { useLocation } from "react-router-dom";
import appConfig from "webpack-config-loader!../../app-config.js";
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
`;

const ItemWrapper = styled.div`
  margin: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;
  width: 100%;
  justify-content: space-between;
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

  const location = useLocation();
  const bountyId = location.state.BountyId;

  const [bountyDetails, setBountyDetails] = React.useState({ ...instialState });
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
  const [requestToWorkHandler, setRequestToWorkHandler] = React.useState({
    ...requestToWorkState,
  });
  const { account, ethereum } = useMetaMask();

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);

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

  const loadBountyDetails = async () => {
    await axios
      .get(`${appConfig.apiBaseUrl}bounties/${bountyId}`)
      .then((response) => {
        setBountyDetails((prevState) => ({
          ...prevState,
          categoryName: response.data?.CategoryId?.categoryName,
          subCatergoryName: response.data?.SubCategoryId?.subCategoryName,
          bountyamout: response.data?.BountyAmount,
          bountyStatus: response.data?.BountyStatus,
          smartContractAddress: response.data?.SmartContractAddress,
          topics: response.data?.Topics,
          customerId: response.data?.CustomerId?.Id,
          loading: false,
        }));
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

  if (bountyDetails.loading || loader) {
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

        <a
          style={{ textDecoration: "none" }}
          href={`https://rinkeby.etherscan.io/address/${bountyDetails.smartContractAddress}`}
          target="_blank"
        >
          <Button variant="negative">View on blockchain explorer</Button>
        </a>

        {bountyDetails.customerId !== globalState.accountId && bountyDetails.bountyStatus === "Active" && (
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
            <ButtonWrapper>
              <Button onPress={() => setShowModal(true)} variant="negative">
                Cancel
              </Button>
              <Button onPress={getBoundyHandler} variant="negative">
                Get Bounty
              </Button>

              <input
                ref={inputFileRef}
                style={{ display: "none" }}
                onChange={ImageUploadHandler}
                type="file"
              />

              {imageLoader ? (
                <ProgressCircle aria-label="Loading…" isIndeterminate />
              ) : (
                <Button variant="negative" onPress={ImageHandler}>
                  Upload Related Files
                </Button>
              )}
              <Button
                onPress={async () => await getStatus()}
                variant="negative"
              >
                Get Status
              </Button>
            </ButtonWrapper>
          </>
        ) : null}
      </BountyDeteilsWrapper>

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
