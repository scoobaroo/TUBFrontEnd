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
import JoditEditor from "jodit-react";
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
import abi from "../../abi/Bounty.json";
import bytecode from "../../abi/Bytecode.json";
import ABI from "../../abi/BountyABI.json";
import BountyBytecode from "../../abi/BountyBytecode.json";
import { useMetaMask } from "metamask-react";
import ErrorModal from "../../components/ErrorModal";

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9999;
`;

const BountyFormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 16px;
  margin: 16px;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  svg {
    padding: 0px !important;
  }
  button {
    margin-top: 16px;
  }
`;

const TopicsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  div {
    padding: 8px 8px 8px 0;
  }
`;

const FormContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap:30px;
background: rgb(200 200 200 / 2%);
    border: 1px solid rgb(239 239 239 / 5%);
    padding: 16px;
    border-radius: 5px;
    margin-top: 17px;
    @media (max-width: 768px) {
grid-template-columns: 1fr;
    }
}
textarea{
  height:158px !important;
}
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  button {
    margin-top: 21px;
    @media (max-width: 768px) {
      margin-top: 10px;
      margin-left: auto;
    }
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
  const [selectedCatogories, setSelectedCatogories] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [authUserId, setAuthUserId] = React.useState(null);
  const [accountId, setAccountId] = React.useState(null);
  const [bountyAmount, setBountyAmount] = React.useState();
  const [contract, setContract] = React.useState();
  const [amount, setAmount] = React.useState();
  const [initalAmount, setInitialAmount] = React.useState("");
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
  const [showMessage, setShowMessage] = React.useState(false);
  const [createNewBountyError, setCreateNewBountyError] = React.useState("");
  const [globalState] = React.useContext(AppContext);
  const editor = React.useRef(null);
  const [content, setContent] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState();
  const [textEditor, setTextEditor] = React.useState(false);

  React.useEffect(() => {
    if (_state.authUser && _state.authUser.uid) {
      setAuthUserId(_state.authUser.uid);
    }
  }, [_state.authUser]);

  const config = React.useMemo(() => {
    return {
      readonly: false,
      placeholder: placeholder || "Start typings...",
      height: 440,
      background: "#fff",
    };
  }, [placeholder]);

  React.useEffect(() => {
    if (
      status !== "initializing" &&
      status !== "connected" &&
      status !== "connecting"
    ) {
      setShowMessage(true);
      setShowBountyError(true);
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
    if (selectedCatogories && selectedCatogories.length) {
      setSelectedCatogories([]);
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
    if (selectedCatogories && selectedCatogories.length)
      setSelectedCatogories([]);
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

  const isValid = React.useMemo(
    () => /^-{0,1}\d*\.{0,1}\d+$/.test(initalAmount),
    [initalAmount]
  );

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
      let message = error.toString();
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      setCreateNewBountyError(
        error.message ? error.message : message ? message : "Bounty not created"
      );
      setShowBountyError(true);
    }
  };

  const modalConfirmHandler = () => {
    if (status === "connected") {
      setShowMessage(false);
      if (!isValid) {
        return;
      }
      setCreateBountyModal(true);
    } else {
      setShowMessage(true);
      setShowBountyError(true);
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
    let contractFactory;
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

  const handleTopicChange = (categoryId) => {
    const filtered = state.categories.filter(
      (x) => x.categoryId === categoryId
    );
    if (selectedCatogories.length < 5) {
      const merged = [...selectedCatogories, ...filtered];
      const cleanTopics = sanitizeByKey(merged, "categoryId");
      setSelectedCatogories(cleanTopics);
    }
  };

  const handleDeleteTopic = (categoryId) => {
    const filtered = selectedCatogories.filter(
      (x) => x.categoryId !== categoryId
    );
    setSelectedCatogories(filtered);
  };

  const handleSubmitNewBounty = (values) => {
    console.log(content);
    const id = window.localStorage.getItem("accountId");
    console.log(values);
    const selectedCatogoriesList = selectedCatogories?.map((x) => x.categoryId);
    let bountyObject;
    const ERC20Chain = globalState.Erc20Chains?.find(
      (chain) => chain.cob_hexcode === chainId
    );
    if (bountyName === "Create New Bounty") {
      bountyObject = {
        Name: "default",
        CategoryIds: selectedCatogoriesList,
        Description: discription,
        Requirements: [requirements],
        AccountId: accountId,
        SmartContractAddress: values.contractAddress,
        BountyAmount: Number(initalAmount),
        CustomerId: id,
        ERC20ChainId: ERC20Chain.cob_erc20chainid,
        ERC20Chain: "769020000",
        RichText: content,
      };
    } else if (bountyName === "Create New Designated Bounty") {
      bountyObject = {
        Name: "designated",
        CategoryIds: [categoryId],
        Description: discription,
        Requirements: [requirements],
        AccountId: accountId,
        SmartContractAddress: values.contractAddress,
        BountyAmount: Number(initalAmount),
        CustomerId: id,
        ERC20ChainId: ERC20Chain.cob_erc20chainid,
        ERC20Chain: "769020000",
        RichText: content,
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
    if (/^\d*\.?\d*$/.test(value)) {
      setInitialAmount(value);
    }
  };

  const setTectEditorContent = (e) => {
    // let value = e.replace(/(<([^>]+)>)/gi, "");
    if (e.length > 1048576) {
      setTextEditor(true);
      return;
    } else {
      setContent(e);
    }
  };

  return (
    <BountyFormWrapper>
      {state.loading && (
        <LoadingWrapper>
          <div>
            <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
          </div>
          <div>please wait...</div>
        </LoadingWrapper>
      )}
      {state.categories && (
        <>
          <h2>📜 {bountyName}</h2>

          <FormContainer>
            <div>
              <ComboBox
                label="Select Category"
                items={state.categories}
                onSelectionChange={handleTopicChange}
                width="100%"
                marginBottom={10}
              >
                {(item) => (
                  <Item key={item.categoryId}>{item.categoryName}</Item>
                )}
              </ComboBox>
              <TopicsWrapper>
                {selectedCatogories?.map((item, idx) => (
                  <div key={idx}>
                    <Button onPress={() => handleDeleteTopic(item.categoryId)}>
                      <span>{item.categoryName}</span>
                      {` `}
                      <FcFullTrash />
                    </Button>
                  </div>
                ))}
              </TopicsWrapper>
              {selectedCatogories.length > 0 && (
                <FormWrapper>
                  <TextArea
                    value={discription}
                    onChange={setDiscription}
                    width="auto"
                    label="Description"
                    marginBottom={10}
                  />
                  <TextArea
                    onChange={setRequirements}
                    width="auto"
                    label="Requirements"
                    marginBottom={10}
                  />
                </FormWrapper>
              )}
            </div>

            <div>
              {selectedCatogories.length > 0 && (
                <FormWrapper>
                  <JoditEditor
                    maxLength={5}
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1} // tabIndex of textarea
                    onChange={(newContent) => setTectEditorContent(newContent)}
                  />
                  {/* <Button variant="cta">Create</Button>           */}

                  <ButtonWrapper>
                    <TextField
                      validationState={isValid ? "valid" : "invalid"}
                      label="Bounty Amount"
                      value={initalAmount}
                      onChange={initialAmountOnChange}
                    />
                    <Button
                      onPress={() => modalConfirmHandler()}
                      variant="primary"
                    >
                      Create Bounty
                    </Button>
                  </ButtonWrapper>
                </FormWrapper>
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
                  {showMessage
                    ? "please connect to the network"
                    : `${createNewBountyError}`}
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
                    You are attempting to create a bounty on {network} network.
                    Proceed?
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
            </div>
          </FormContainer>
          {textEditor && (
            <ErrorModal open={textEditor} message={'maximum length exceeded'} action={() => setTextEditor(false)} />

          )}
        </>
      )}
    </BountyFormWrapper>
  );
}

const NewBounty = compose(withRouter, withFirebase)(NewBountyBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(NewBounty);
