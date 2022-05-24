import React from "react";
import axios from "axios";
import { Button, ProgressCircle, Well } from "@adobe/react-spectrum";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import appConfig from "webpack-config-loader!../../app-config.js";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import { AppContext } from "../../context";


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
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const initialState = {
  allBounties: null,
  loading: true,
  error: null,
};

const BountiesBase = ({ firebase, navigate }) => {
  const [state] = React.useContext(AppContext);
  const [State, setState] = React.useState({ ...initialState });
  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      allBounties: [],
      loading: true,
    }));
    getCustomerBounties();
  }, []);


  const getCustomerBounties = () => {
    axios
      .get(`${appConfig.apiBaseUrl}users/${state.accountId}/customerbounties`)
      .then((response) => {
        if (response.status === 200) {
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
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error,
        }));
      });
  };

  const goToBounty = (bounty) => {
    navigate("/bountydetails", { state: { BountyId: bounty.cob_bountyid, SmartContractAddress: bounty.cob_smartcontractaddress } });
  }

  // console.log('state from allBounties page', state);
  if (State.loading && !State.bounties) {
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
      {State.allBounties && !State.loading && (
        <BountyGrid>
          {State.allBounties?.map((bounty) => (
            bounty._cob_customerid_value == state.accountId && (
              <Well key={bounty.cob_bountyid}>
                <div>{bounty.cob_name}</div>
                <div>{bounty.cob_description || `No Description`}</div>
                <Button onClick={() => goToBounty(bounty)} >View Bounty</Button>
              </Well>
            )))}
        </BountyGrid>
      )}
      {State.loading && (
        <LoadingWrapper>
          <div>
            <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
          </div>
          <div>please wait...</div>
        </LoadingWrapper>
      )}
    </div>
  );
};

const MyCreatedBounties = compose(withRouter, withFirebase)(BountiesBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(MyCreatedBounties);
