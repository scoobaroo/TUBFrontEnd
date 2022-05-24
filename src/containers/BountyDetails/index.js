import { useLocation } from "react-router-dom";
import appConfig from "webpack-config-loader!../../app-config.js";
import {
  Heading,
  Link,
  TextField,
  Button,
  ProgressCircle,
  AlertDialog,
  DialogTrigger,
  ActionButton,
} from "@adobe/react-spectrum";
import { ethers, getDefaultProvider, utils } from "ethers";
import styled from "styled-components";
import React from "react";
import axios from "axios";
import abi from "../../Bounty.json";
import { AppContext } from "../../context";

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

const BountyDetails = () => {
  const instialState = {
    categoryName: "",
    subCatergoryName: "",
    bountyamout: "",
    bountyStatus: "",
    SmartContractAddress: "",
    topics: [],
    loading: true,
  };
  const intialMessage = {
    cancel: false,
    getBounty: false,
  };
  const location = useLocation();
  const bountyId = location.state.BountyId;

  const [bountyDetails, setBountyDetails] = React.useState({ ...instialState });
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
  }, []);

  const loadBountyDetails = async () => {
    await axios
      .get(`${appConfig.apiBaseUrl}bounties/${bountyId}`)
      .then((response) => {
        console.log("bounty response=>");
        console.log(response.data);
        setBountyDetails((prevState) => ({
          ...prevState,
          categoryName: response.data.CategoryId.categoryName,
          subCatergoryName: response.data.SubCategoryId.subCategoryName,
          bountyamout: response.data.BountyAmount,
          bountyStatus: response.data.BountyStatus,
          smartContractAddress: response.data.SmartContractAddress,
          topics: response.data.Topics,
          customerId: response.data.CustomerId.Id,
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
    console.log(amount);
  };

  const getBounty = async () => {
    console.log("In getBounty");
    console.log("provider =>", provider);
    console.log("contract =>", contract);
    let contract = new ethers.Contract(
      bountyDetails.smartContractAddress,
      abi,
      provider.getSigner()
    );
    // contract.connect(provider.getSigner());
    let bountyAmount = await contract.getBounty();
    let amount = parseInt(bountyAmount._hex, 16).toString();
    console.log("amount =>", amount);
    console.log("typeof amont:" + typeof amount);
    console.log("bountyAmount =>", ethers.utils.formatEther(amount));
    bountyAmount = ethers.utils.formatEther(amount);
    setBountyAmount(bountyAmount);
  };

  const cancel = async () => {
    setShowModal(false);
    console.log("In Cancel");
    let contract = new ethers.Contract(
      bountyDetails.smartContractAddress,
      abi,
      provider.getSigner()
    );
    console.log("provider =>", provider);
    console.log("contract =>", contract);
    let result = await contract.cancel();
    console.log("cancel result =>", result);
  };

  const getStatus = async () => {
    console.log("In getStatus");
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
      }));
      console.log("cancel success");
    } catch (error) {
      setShowError(true);
      setMessage((prevState) => ({
        ...prevState,
        cancel: true,
        getBounty: false,
      }));
      console.log(error);
      console.log("cancel error");
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
      }));
      console.log("getBounty success");
    } catch (error) {
      setShowError(true);
      setMessage((prevState) => ({
        ...prevState,
        getBounty: true,
        cancel: false,
      }));
      console.log(error);
      console.log("getBounty error");
    }
  };

  if (bountyDetails.loading) {
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

        {bountyDetails.customerId !== globalState.accountId &&
        globalState.mode !== "provider" ? (
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
              {/* <span>
            Bounty Amount:{" "}
            {bountyAmount != undefined ? bountyAmount + "ETH" : ""}
          </span> */}
              <Button
                onPress={async () => await getStatus()}
                variant="negative"
              >
                Get Status
              </Button>
              {/* <span>{active ? "Active" : "Inactive"}</span> */}
            </ButtonWrapper>
          </>
        ) : null}
      </BountyDeteilsWrapper>
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
          title={message.cancel ? "Cancel Success" : "Get Bounty Success"}
          variant="information"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowSuccess(false)}
        >
          {message.cancel
            ? "Bounty cancelled successfully"
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
          {message.getBounty ? "Bounty not found" : "Failed to cancel bounty."}
        </AlertDialog>
      </DialogTrigger>
    </BountyWrapper>
  );
};

export default BountyDetails;
