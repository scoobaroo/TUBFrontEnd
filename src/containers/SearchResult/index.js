import React from "react";
import { withFirebase } from "../../firebase";
import withRouter from "../../session/withRouter";
import { compose } from "recompose";
import withAuthorization from "../../session/withAuthorization";
import appConfig from "webpack-config-loader!../../app-config.js";
import styled from "styled-components";
import axios from "axios";
import {
  ProgressCircle,
  Well,
  SearchField,
  Flex,
  ComboBox,
  Item,
  Button,
} from "@adobe/react-spectrum";
import { Column } from "@react-stately/table";

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
  & .outer-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  & .bounty-name {
    word-break: break-all;
    font-weight: bold;
    border-bottom: 1px solid #3d3b3b;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
`;

const NoData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #8a7e7e;
`;

const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButttonWrapper = styled.div`
  display: flex;
  justify-content: end;
  margin-top: auto;
`;

const BountyList = ({ BountyDetails, ProfileView, BountyHandler }) => {
  console.log("BountyDetails =>", BountyDetails);
  return BountyDetails.value.map((value) =>
    value.document["@search.entitycollection.displayname"] === "Bounties" ? (
      <Well>
        <div className="outer-wrapper">
          <div className="bounty-name">
            {value.document["@search.entitycollection.displayname"]}
          </div>
          <div>{value.document.cob_description}</div>
          <div>{value.document.cob_name}</div>
          <ButttonWrapper>
            <Button
              onPress={() => BountyHandler(value.document["@search.objectid"])}
            >
              View Bounty
            </Button>
          </ButttonWrapper>
        </div>
      </Well>
    ) : value.document["@search.entitycollection.displayname"] ===
      "Accounts" ? (
      <Well>
        <div className="outer-wrapper">
          <div className="bounty-name">
            {value.document["@search.entitycollection.displayname"]}
          </div>
          <div>{value.document.name}</div>
          <ButttonWrapper>
            <Button
              onPress={() => ProfileView(value.document["@search.objectid"])}
            >
              View profile
            </Button>
          </ButttonWrapper>
        </div>
      </Well>
    ) : null
  );
};

const SearchView = (props) => {
  const [details, setDetails] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const searchKey = props.location.state.keyword;
  const searchItem = props.location.state.value;
  React.useEffect(() => {
    getDetails();
  }, [searchKey, searchItem]);
  const getDetails = () => {
    setLoader(true);
    const keyword = props.location.state.keyword;
    const value = props.location.state.value;
    console.log(value);
    if (value === "Account") {
      accountsearchHandler(keyword);
    } else if (value === "Bounty") {
      bountySearchHandler(keyword);
    }
  };

  const bountySearchHandler = (keyword) => {
    axios
      .post(`${appConfig.apiBaseUrl}search/bounties`, { Request: keyword })
      .then((res) => {
        setLoader(false);
        console.log("res =>", res);
        setDetails(res.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log("err =>", err);
      });
  };

  const accountsearchHandler = (keyword) => {
    axios
      .post(`${appConfig.apiBaseUrl}search/accounts`, { Request: keyword })
      .then((res) => {
        setLoader(false);
        console.log("res =>", res);
        setDetails(res.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log("err =>", err);
      });
  };

  const profileView = (id) => {
    setLoader(true);
    axios
      .get(`${appConfig.apiBaseUrl}users/accountId/${id}`)
      .then((response) => {
        setLoader(false);
        console.log("res =>", response);
        let imageUrl;
        const string2 = response.data.cob_profilepicture;
        const string1 = "data:image/png;base64,";
        imageUrl = string1.concat(string2);
        props.navigate("/userprofile", {
          state: {
            edit: false,
            id: id,
          },
        });
      })
      .catch((err) => {
        console.log("err =>", err);
      });
  };

  const goToBounty = (bounty) => {
    props.navigate("/bountydetails", {
      state: {
        BountyId: bounty,
      },
    });
  };

  if (loader) {
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
    <BountyGrid>
      {details.length !== 0 ? (
        <BountyList
          BountyDetails={details}
          ProfileView={profileView}
          BountyHandler={goToBounty}
        />
      ) : (
        <NoData>No Data</NoData>
      )}
    </BountyGrid>
  );
};

const SearchResult = compose(withRouter, withFirebase)(SearchView);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(SearchResult);
