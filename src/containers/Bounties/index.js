import React from 'react';
import axios from 'axios';
import { ProgressCircle, Well } from '@adobe/react-spectrum';
import styled from 'styled-components';
import appConfig from 'webpack-config-loader!../../app-config.js';
import withAuthorization from '../../session/withAuthorization';
import { withFirebase } from '../../firebase';
import { compose } from 'recompose';
import withRouter from '../../session/withRouter';

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

  @media (max-width: 750px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const BountyCard = ({ bounty }) => {
  return (
    <Well>
      <div>
        {bounty.cob_name}
      </div>
      <div>
        {bounty.cob_description || `No Description`}
      </div>
    </Well>
  )
}

const initialState = {
  allBounties: null,
  loading: true,
  error: null,
};

const BountiesBase = ({ firebase, navigate }) => {
  const [state, setState] = React.useState({ ...initialState })
  React.useEffect(() => {
    axios({
      method: 'get',
      url: `${appConfig.apiBaseUrl}bounties`,
    })
    .then((response) => {
      if (response.status === 200) {
        const { data: { value } } = response
        const allBounties = [...new Set(value)];
        setState((prevState) => ({
          ...prevState,
          allBounties,
          loading: false,
        }))

      }
    })
    .catch((error) => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error
      }))
    })
  }, []);
  // console.log('state from allBounties page', state);
  if (state.loading && !state.bounties) {
    return (
      <LoadingWrapper>
        <div>
          <ProgressCircle size='L' aria-label="Loading…" isIndeterminate />
        </div>
        <div>
          please wait...
        </div>
      </LoadingWrapper>
    )
  }
  return (
    <div>
      {state.allBounties && !state.loading && (
        <BountyGrid>
          {state.allBounties.map((bounty) => (
            <BountyCard
              key={bounty.cob_bountyid}
              bounty={bounty}
            />
          ))}
        </BountyGrid>
      )}
    </div>
  )
}

const Bounties = compose(withRouter, withFirebase)(BountiesBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Bounties);
