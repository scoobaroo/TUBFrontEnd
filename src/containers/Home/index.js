import React from 'react';
import { useMetaMask } from "metamask-react";

import withAuthorization from '../../session/withAuthorization';
import { withFirebase } from '../../firebase';
import { compose } from 'recompose';
import withRouter from '../../session/withRouter';

function MetaMask() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>

  if (status === "unavailable") return <div>MetaMask not available :(</div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") return <div>Connecting...</div>

  if (status === "connected") return <div>Connected account {account} on chain ID {chainId}</div>

  return null;
}

const HomeBase = ({ firebase }) => {
  return (
    <div>
      <MetaMask />
    </div>
  )
}

const Home = compose(withRouter, withFirebase)(HomeBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
