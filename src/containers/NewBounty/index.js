import React from "react";
import {
  Button,
  ComboBox,
  Item,
  ProgressCircle,
  TextArea,
  TextField,
  Picker,
  AlertDialog,
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
} from "@adobe/react-spectrum";
import { FcFullTrash } from "react-icons/fc";
import axios from "axios";
import styled from "styled-components";
import appConfig from "webpack-config-loader!../../app-config.js";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { AppContext } from "../../context";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import { ethers, getDefaultProvider, utils } from "ethers";

import { fs } from "fs";

import abi from "../../abi/Bounty.json";
import bytecode from "../../abi/Bytecode.json";
import ABI from "../../abi/BountyABI.json";
import BountyBytecode from "../../abi/BountyBytecode.json";
import { call } from "file-loader";
import { Navigate } from "react-router-dom";
import { useMetaMask } from "metamask-react";
import Network from "../../helper/metamask-network";

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BountyFormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 16px;
  margin: 16px;
`;

const TopicsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  div {
    padding: 8px 8px 8px 0;
  }
`;

const initialState = {
  categories: null,
  loading: true,
  error: null,
  selected: null,
  valid: false,
};

function NewBountyBase(props) {
  const [active, setActive] = React.useState();
  const [state, setState] = React.useState({ ...initialState });
  const [_state] = React.useContext(AppContext);
  const [categoryId, setCategoryId] = React.useState();
  const [subCategoryId, setSubCategoryId] = React.useState();
  const [topics, setTopics] = React.useState([]);
  const [selectedTopics, setSelectedTopics] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [requirements, setRequirements] = React.useState();
  const [authUserId, setAuthUserId] = React.useState(null);
  const [accountId, setAccountId] = React.useState(null);
  const [bountyAmount, setBountyAmount] = React.useState();
  const [contract, setContract] = React.useState();
  const [amount, setAmount] = React.useState();
  const [initalAmount, setInitialAmount] = React.useState();
  const [provider, setProvider] = React.useState();
  const [smartContractAddress, setSmartContractAddress] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [showBountyError, setShowBountyError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [discription, setDiscription] = React.useState("");
  const [bountyName, setBounyName] = React.useState("");
  const [createBountyModal, setCreateBountyModal] = React.useState(false);
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [network, setNetwork] = React.useState();
  const [chainValue, setChainValue] = React.useState();
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    if (_state.authUser && _state.authUser.uid) {
      setAuthUserId(_state.authUser.uid);
    }
  }, [_state.authUser]);

  React.useEffect(() => {
    if(status !== "initializing" && status !== "connected"){
      setShowMessage(true);
      setShowBountyError(true)
    }
  }, [status]);

  React.useEffect(() => {
    if (_state.accountId) {
      setAccountId(_state.accountId);
    }
  }, [_state.accountId]);

  React.useEffect(() => {
    if (subCategoryId && state.selected.subCategories) {
      const [results] = state.selected.subCategories.filter(
        (x) => x.subCategoryId === subCategoryId
      );
      setTopics(results.topics);
    }
    if (selectedTopics && selectedTopics.length) {
      setSelectedTopics([]);
    }
  }, [subCategoryId]);

  React.useEffect(() => {
    setBounyName(props.location.state.Bounty);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    let isSubsribed = true;
    if (isSubsribed) getCategories();
    return () => (isSubsribed = false);
  }, [props.location]);

  React.useEffect(() => {
    let isSubsribed = true;
    if (selectedTopics && selectedTopics.length) setSelectedTopics([]);
    if (topics?.length) setTopics([]);
    if (state.categories && isSubsribed) {
      const [selected] = state.categories.filter(
        (x) => x.categoryId === categoryId
      );
      setState((prevState) => ({
        ...prevState,
        selected,
      }));
    }
    return () => (isSubsribed = false);
  }, [categoryId]);

  const sanitizeByKey = (arr, key) => [
    ...new Map(arr.map((item) => [item[key], item])).values(),
  ];

  const getCategories = () => {
    if (_state.categorys) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        categories: _state.categorys,
      }));
    } else {
      const categoriesUrl = `${appConfig.apiBaseUrl}categories`;
      axios
        .get(categoriesUrl)
        .then(({ status, data }) => {
          if (status === 200) {
            const categories = [...new Set(data)];
            const loading = false;
            setState((prevState) => ({
              ...prevState,
              categories,
              loading,
            }));
          }
        })
        .catch((error) => {
          console.log("there was an error:", error);
        })
        .finally(() => {});
    }
  };

  const setChaninIdHandler = (name) => {
    let mainString = name;
    let subString;
    const value = _state.RequestWork;
    value?.filter((item) => {
      subString = item.Label.UserLocalizedLabel.Label;
      if (mainString.includes(`${subString}`)) {
        setChainValue(item.Value);
      }
    });
  };

  const createNewBounty = async () => {
    setCreateBountyModal(false);
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const result = await deployBounty();
      if (result) {
        handleSubmitNewBounty(result);
      }
    } catch (error) {
      console.log(error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      setShowBountyError(true);
    }
  };

  const modalConfirmHandler = () => {
    if (status === "connected") {
      setShowMessage(false);
      const network = Network.find((chain) => chain.hex === chainId);
      if (network) {
        setNetwork(network.name);
        setChaninIdHandler(network.name);
      }
      setCreateBountyModal(true);
      if (bountyName === "Create New Designated Bounty") {
        setChaninIdHandler(network.name);
      }
    }else{
      setShowMessage(true);
      setShowBountyError(true)
    }
  };

  const modalCancleHandler = () => {
    setCreateBountyModal(false);
  };

  const deployBounty = async () => {
    let accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts);
    const signer = await provider.getSigner();
    console.log("signer =>", signer);
    const signerAddress = await signer.getAddress();
    console.log("Signer Address =>", signerAddress);
    let blockNumber = await provider.getBlockNumber();
    console.log("blockNumber =>", blockNumber);
    let balance = await provider.getBalance(accounts[0]);
    console.log("balance =>", balance);
    var etherFormatted = ethers.utils.formatEther(balance);
    console.log("etherFormatted =>", etherFormatted);
    console.log("abi=>", abi);
    console.log("bytecode =>", bytecode);
    let contractFactory
    if (bountyName === "Create New Bounty") {
      contractFactory = new ethers.ContractFactory(
        abi,
        bytecode.object,
        provider.getSigner()
      );
    } else if (bountyName === "Create New Designated Bounty") {
      contractFactory = new ethers.ContractFactory(
        ABI,
        BountyBytecode.object,
        provider.getSigner()
      );
    }

    // let init = prompt("How much ether would you like to put into this smart contract?");
    console.log("INIT =>", initalAmount);
    const initialValue = { value: ethers.utils.parseEther(initalAmount) };
    let contract = await contractFactory.deploy(initialValue);
    setContract(contract);
    console.log("contract =>", contract);
    console.log("contract address =>", contract.address);
    setSmartContractAddress(contract.address);
    console.log("console.deployTransaction =>", contract.deployTransaction);
    let result = await contract.deployTransaction.wait();
    console.log("result =>", result);
    console.log("result");
    return result;
  };

  if (state.loading) {
    return (
      <LoadingWrapper>
        <div>
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </div>
        <div>please wait...</div>
      </LoadingWrapper>
    );
  }

  const handleTopicChange = (topicId) => {
    const filtered = topics.filter((x) => x.topicId === topicId);
    const merged = [...selectedTopics, ...filtered];
    const cleanTopics = sanitizeByKey(merged, "topicId");
    setSelectedTopics(cleanTopics);
  };

  const handleDeleteTopic = (topicId) => {
    const filtered = selectedTopics.filter((x) => x.topicId !== topicId);
    setSelectedTopics(filtered);
  };

  const handleDescChange = (value) => {
    setDescription(value);
  };

  const handleReqChange = (value) => {
    setRequirements(value);
  };

  const handleSubmitNewBounty = (values) => {
    const id = window.localStorage.getItem("accountId");
    console.log(values);
    const selectedTopicsList = selectedTopics?.map((x) => x.topicId);
    console.log(selectedTopicsList);
    let bountyObject;
    if (bountyName === "Create New Bounty") {
      bountyObject = {
        Name: "default",
        CategoryIds: [categoryId],
        SubCategoryIds: [subCategoryId],
        Description: discription,
        Requirements: [requirements],
        TopicIds: [...new Set(selectedTopicsList)],
        AccountId: accountId,
        SmartContractAddress: values.contractAddress,
        BountyAmount: Number(initalAmount),
        SubTopicIds: [],
        CustomerId: id,
        ERC20Chain: chainValue.toString(),
      };
    } else if (bountyName === "Create New Designated Bounty") {
      bountyObject = {
        Name: "designated",
        CategoryIds: [categoryId],
        SubCategoryIds: [subCategoryId],
        Description: discription,
        Requirements: [requirements],
        TopicIds: [...new Set(selectedTopicsList)],
        AccountId: accountId,
        SmartContractAddress: values.contractAddress,
        BountyAmount: Number(initalAmount),
        SubTopicIds: [],
        CustomerId: id,
        ERC20Chain: chainValue.toString(),
      };
    }
    axios
      .post(`${appConfig.apiBaseUrl}bounties/new`, bountyObject)
      .then((response) => {
        if (response.data) {
          console.log("response =>", response);
          setShowSuccess(true);
          props.navigate("/bountydetails", {
            state: {
              BountyId: response.data.BountyId,
              SmartContractAddress: values.contractAddress,
            },
          });
          console.log("Success");
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      })
      .catch((error) => {
        console.log("there was error:", error);
        setShowError(true);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  const initialAmountOnChange = (value) => {
    console.log("initalAmt" + value);
    setInitialAmount(value);
  };

  return (
    <BountyFormWrapper>
      <div>
        <h1>📜 {bountyName}</h1>
      </div>
      <ComboBox
        placeholder="Select Category"
        items={state.categories}
        onSelectionChange={setCategoryId}
      >
        {(item) => <Item key={item.categoryId}>{item.categoryName}</Item>}
      </ComboBox>
      {!!state.selected && state.selected.subCategories.length > 0 && (
        <ComboBox
          placeholder="Select Sub Category"
          items={state.selected.subCategories}
          onSelectionChange={setSubCategoryId}
        >
          {(item) => (
            <Item key={item.subCategoryId}>{item.subCategoryName}</Item>
          )}
        </ComboBox>
      )}
      {!!topics?.length && (
        <ComboBox
          items={topics}
          placeholder="Select Topic(s)"
          onSelectionChange={handleTopicChange}
        >
          {(item) => <Item key={item.topicId}>{item.topicName}</Item>}
        </ComboBox>
      )}
      {!!selectedTopics && !!selectedTopics.length && (
        <TopicsWrapper>
          {selectedTopics?.map((item, idx) => (
            <div key={idx}>
              <Button onPress={() => handleDeleteTopic(item.topicId)}>
                <span>{item.topicName}</span>
                {` `}
                <FcFullTrash />
              </Button>
            </div>
          ))}
        </TopicsWrapper>
      )}
      {state.selected && (
        <>
          <TextField
            value={discription}
            onChange={setDiscription}
            width="auto"
            label="Description"
          />
          <TextArea
            onChange={handleReqChange}
            width="auto"
            label="Requirements"
          />
          {/* <Button variant="cta">Create</Button>           */}
          <TextField value={initalAmount} onChange={initialAmountOnChange}>
            Initial Amount
          </TextField>
          <Button onPress={() => modalConfirmHandler()} variant="primary">
            Create Bounty
          </Button>
        </>
      )}
      <DialogTrigger isOpen={showError}>
        <></>
        <AlertDialog
          title="Failed"
          variant="error"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowError(false)}
        >
          Failed saving the bounty. Please try again later.
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
          {showMessage ? "please connect to the network" : "Insufficient fund for intrisinc transaction. Please try later."}
        </AlertDialog>
      </DialogTrigger>
      <DialogTrigger isOpen={showSuccess}>
        <></>
        <AlertDialog
          title="Bounty Saved"
          variant="information"
          primaryActionLabel="OK"
          onPrimaryAction={() => setShowSuccess(false)}
        >
          Bounty saved successfully.
        </AlertDialog>
      </DialogTrigger>

      <DialogTrigger isOpen={createBountyModal}>
        <></>
        <Dialog>
          <Heading>create bounty</Heading>
          <Divider />
          <Content>
            {" "}
            You are attempting to create a bounty on {network} network. Proceed?
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={modalCancleHandler}>
              Cancel
            </Button>
            <Button
              variant="cta"
              onPress={async () => await createNewBounty()}
              autoFocus
            >
              Confirm
            </Button>
          </ButtonGroup>
        </Dialog>
      </DialogTrigger>
    </BountyFormWrapper>
  );
}

const NewBounty = compose(withRouter, withFirebase)(NewBountyBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(NewBounty);
