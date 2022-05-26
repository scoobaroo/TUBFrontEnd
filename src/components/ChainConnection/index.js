import React from "react";
import { useMetaMask } from "metamask-react";

import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import styled from "styled-components";
import { AppContext } from "../../context";
import Network from "../../helper/metamask-network";
import { JsonRpcBatchProvider } from "@ethersproject/providers";

const ButtonWrapper = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin-right: 7px;
  background: #85d044;
  flex-shrink: 0;
`;

const MetaMask = () => {
  console.log("MetaMask", Network);
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [network, setNetwork] = React.useState();

  window.ethereum.on("chainChanged", (chainId) => {
    console.log("chainChanged", chainId);
    const network = Network.find(chain => chain.hex === chainId);
    if (network) {
      setNetwork(network.name);
    }
  });

  React.useEffect(() => {
    if (status === "connected") {
      const network = Network.find(chain => chain.hex === chainId);
      if (network) {
        setNetwork(network.name);
      }
    }
  }, [status]);

  if (status === "initializing")
    return <div>Synchronisation with MetaMask ongoing...</div>;

  if (status === "unavailable") return <div>MetaMask not available</div>;

  if (status === "notConnected")
    return <button onClick={connect}>Connect to MetaMask</button>;

  if (status === "connecting") return <div>Connecting...</div>;

  if (status === "connected")
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ButtonWrapper>
          <span></span>
        </ButtonWrapper>
        {`${network}`}
      </div>
    );

  return null;
};

const ConnectionBase = ({ firebase, navigate }) => {
  return (
    <div>
      <MetaMask />
    </div>
  );
};

const Connection = compose(withRouter, withFirebase)(ConnectionBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Connection);
