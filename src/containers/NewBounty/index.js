import React from 'react';
import { Button, ComboBox, Item, ProgressCircle, TextArea, TextField} from '@adobe/react-spectrum'
import axios from 'axios';
import styled from 'styled-components';
import withAuthorization from '../../session/withAuthorization';
import { withFirebase } from '../../firebase';
import { compose } from 'recompose';
import withRouter from '../../session/withRouter';
import {ethers, getDefaultProvider, utils} from 'ethers';
import { fs } from 'fs';

import abi from '../../Bounty.json';
import bytecode from '../../Bytecode.json';
import { call } from 'file-loader';

const BountyFormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 16px;
  margin: 16px;
`;

const initialState = {
  categories: null,
  loading: true,
  error: null,
  selected: null,
  valid: false,
}


function NewBountyBase() {
  const [state, setState] = React.useState({ ...initialState });
  const [categoryId, setCategoryId] = React.useState();
  const [subCategoryId, setSubCategoryId] = React.useState();
  const [bountyAmount, setBountyAmount] = React.useState();
  const [contract, setContract] = React.useState();
  const [amount, setAmount] = React.useState();
  const [initalAmount, setInitialAmount] = React.useState();
  const [provider, setProvider] = React.useState();
  const [smartContractAddress, setSmartContractAddress] = React.useState();



  const deploy = async () => {
    let accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts);
    const signer = await provider.getSigner();
    console.log("signer =>", signer);
    const signerAddress = await signer.getAddress();
    console.log("Signer Address =>" , signerAddress);
    let blockNumber = await provider.getBlockNumber();
    console.log("blockNumber =>", blockNumber); 
    let balance = await provider.getBalance(accounts[0]);
    console.log("balance =>", balance);
    var etherFormatted = ethers.utils.formatEther(balance)
    console.log("etherFormatted =>" , etherFormatted);
    console.log("abi=>", abi);
    console.log("bytecode =>", bytecode);

    let contractFactory = new ethers.ContractFactory(abi, bytecode.object, provider.getSigner());
    // let init = prompt("How much ether would you like to put into this smart contract?");
    console.log("INIT =>", initalAmount)
    const initialValue = {value: ethers.utils.parseEther(initalAmount)};
    let contract = await contractFactory.deploy(initialValue);
    setContract(contract);
    console.log("contract =>", contract);
    console.log("contract address =>", contract.address);
    setSmartContractAddress(contract.address);
    console.log("console.deployTransaction =>", contract.deployTransaction);
    let result = await contract.deployTransaction.wait();
    console.log("result =>", result);
  }

  React.useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const categoriesUrl = `http://localhost:4000/categories`;
    let isSubsribed = true;
    if (isSubsribed) {
      axios.get(categoriesUrl)
        .then(({ status, data }) => {
          if (status === 200) {
            const categories = [... new Set(data)];
            const loading = false;
            setState((prevState) => ({
              ...prevState,
              categories,
              loading
            }))

            console.log('categories =>', categories);
          }
        })
        .catch((error) => {
          console.log('there was an error:', error);
        })
        .finally(() => {

        })
    }
    return () => isSubsribed = false;
  }, []);

  React.useEffect(() => {
    let isSubsribed = true;

    if (state.categories && isSubsribed) {
      const [selected] = state.categories.filter((x) => x.categoryId === categoryId);
      setState((prevState) => ({
        ...prevState,
        selected,
      }))
    }

    return () => isSubsribed = false;
  }, [categoryId]);

  if (state.loading) {
    return (
      <div>
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </div>
    );
  }
  console.log('selected =>', state.selected);

  const getBounty = async () => {
    console.log("In getBounty");
    console.log("provider =>", provider);
    console.log("contract =>", contract);
    // let contract = new ethers.Contract(smartContractAddress, abi, getDefaultProvider())
    // contract.connect(provider.getSigner());
    debugger;
    let bountyAmount = await contract.getBounty();
    let amount = parseInt(bountyAmount._hex,16).toString();
    console.log("amount =>" , amount);
    console.log("typeof amont:" + typeof amount);
    console.log("bountyAmount =>", ethers.utils.formatEther(amount));
    bountyAmount =  ethers.utils.formatEther(amount);
    setBountyAmount(bountyAmount);
  }

  const increaseBounty = async () => {
    let contract = new ethers.Contract(smartContractAddress, abi, provider.getSigner());
    contract.attach(provider.getSigner().getAddress());
    const options = {value: ethers.utils.parseEther(amount)}
    await contract.increaseBounty(options);
  }

  const initialAmountOnChange = (value) =>{
    console.log("initalAmt" + value)
    setInitialAmount(value);
  }

  const amountOnChange = (value) =>{
    console.log("AMT" + value);
    setAmount(value);
  }
  return (
    <BountyFormWrapper>
        <div>
          <h1>📜 Create Bounty</h1>
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
            {(item) => <Item key={item.subCategoryId}>{item.subCategoryName}</Item>}
          </ComboBox>
        )}
        {state.selected && (
          <>
            <TextField width="auto" label="Description" />
            <TextArea width="auto" label="Requirements" />
            <Button variant="cta">Create</Button>
          </>
        )}
        <TextField value={initalAmount} onChange={initialAmountOnChange}>Initial Amount</TextField>
        <Button onPress={async () => await deploy()} variant="primary">Deploy Bounty</Button>
        <TextField value={amount} onChange={amountOnChange}>Amount to Increase</TextField>
        <Button onPress={() => increaseBounty(parseInt(amount))} variant="cta">Increase Bounty</Button>
        <span>Smart Contract Address: {smartContractAddress}</span>
        <Button onPress={async () => await getBounty()} variant="negative">Get Bounty</Button>
        <span>Bounty Amount: {bountyAmount != undefined? bountyAmount + "ETH" : ""}</span>
    </BountyFormWrapper>
  );
}



const NewBounty = compose(withRouter, withFirebase)(NewBountyBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewBounty);
