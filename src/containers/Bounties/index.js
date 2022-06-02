import React from "react";
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
import styled from "styled-components";
import appConfig from "webpack-config-loader!../../app-config.js";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import { ethers, getDefaultProvider, utils } from "ethers";
import withRouter from "../../session/withRouter";
import { AppContext } from "../../context";
import useAccountId from "../../hooks/useAccountId";
const LoadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NewLoading = styled.div`
  min-height: 50vh;
  display: flex;
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
  & .bounty-name {
    word-break: break-all;
  }
`;

const FilterGrid = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 16px;
  @media (max-width: 1200px) {
    flex-wrap: wrap;
  }
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const NewloadingWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #8a7e7e;
`;

const FilterItemWrapper = styled.div`
  margin: 20px;
  @media (max-width: 1200px) {
    width: 31%;
    margin: 5px 10px;
  }
  @media (max-width: 992px) {
    width: 47%;
  }
  @media (max-width: 576px) {
    width: 94%;
  }
  & > div {
    @media (max-width: 1200px) {
      width: 100% !important;
    }
  }
`;

const BountyCard = ({ bounty }) => {
  return (
    <Well>
      <div>{bounty.cob_name}</div>
      <div>{bounty.cob_description || `No Description`}</div>
      <Button onClick={() => goToBounty(bounty)}>View Bounty</Button>
    </Well>
  );
};

const BountyList = ({ filter, BountyDetails }) => {
  return filter.map((bounty) => (
    <Well>
      <div className="bounty-name">{bounty.cob_name}</div>

      <div className="bounty-name">
        {bounty.cob_description || `No Description`}
      </div>
      <Button onClick={() => BountyDetails(bounty)}>View Bounty</Button>
    </Well>
  ));
};

const initialState = {
  bounties: null,
  loading: true,
  error: null,
  filterTopics: null,
  topicCondition: false,
};

const FilterinitialState = {
  categories: null,
  loading: true,
};

const BountiesBase = ({ firebase, navigate }) => {
  const [state, setState] = React.useState({ ...initialState });
  const [filterState, setfilterState] = React.useState({
    ...FilterinitialState,
  });
  const [categoryId, setCategoryId] = React.useState();
  const [subCategoryId, setSubCategoryId] = React.useState();
  const [subCategories, setSubCategories] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [searchFlag, setSearchFlag] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [filerDataConditon, setFilerDataCondition] = React.useState(false);
  const [_state] = React.useContext(AppContext);

  React.useEffect(() => {
    loadAllBounties();
    getCategories();
  }, []);

  React.useEffect(() => {
    if (filterState.categories && categoryId) {
      setLoader(true);
      const [selected] = filterState.categories.filter(
        (x) => x.categoryId === categoryId
      );
      setSubCategories(selected.subCategories);
    }
  }, [categoryId]);

  React.useEffect(() => {
    if (subCategoryId && subCategories) {
      const [results] = subCategories.filter(
        (x) => x.subCategoryId === subCategoryId
      );
      setTopics(results.topics);
    }
  }, [subCategoryId]);

  const loadAllBounties = () => {
    axios({
      method: "get",
      url: `${appConfig.apiBaseUrl}bounties`,
    })
      .then((response) => {
        console.log("bounties",response.data);
        if (response.status === 200) {
          const {
            data: { value },
          } = response;
          const bounties = [...new Set(value)];
          setState((prevState) => ({
            ...prevState,
            bounties,
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
    navigate("/bountydetails", {
      state: {
        BountyId: bounty.cob_bountyid,
        SmartContractAddress: bounty.cob_smartcontractaddress,
      },
    });
  };

  const CategoryFilterHandler = (value) => {
    setCategoryId(value);
    axios
      .get(`${appConfig.apiBaseUrl}bounties/search/?CategoryId=${value}`)
      .then((response) => {
        setSearchFlag(true);
        if (response.status === 200) {
          console.log(response.data, "response.data");
          if (response.data.value.length === 0) {
            console.log("no data");
            setFilerDataCondition(true);
          } else {
            setFilerDataCondition(false);
          }
          const {
            data: { value },
          } = response;

          const bounties = [...new Set(value)];
          setState((prevState) => ({
            ...prevState,
            bounties,
            loading: false,
            topicCondition: false,
          }));
          setLoader(false);
        }
      })
      .catch((error) => {
        setSearchFlag(false);
        console.log(error, "error");
      });
  };

  const subCategoryFilterHandler = (value) => {
    setLoader(true);
    setSubCategoryId(value);
    axios
      .get(
        `${appConfig.apiBaseUrl}bounties/search/?CategoryId=${categoryId}&SubCategoryId=${value}`
      )
      .then((response) => {
        setSearchFlag(true);
        if (response.status === 200) {
          if (response.data.value.length === 0) {
            console.log("no data");
            setFilerDataCondition(true);
          } else {
            setFilerDataCondition(false);
          }
          const {
            data: { value },
          } = response;

          const bounties = [...new Set(value)];
          setState((prevState) => ({
            ...prevState,
            bounties,
            loading: false,
            topicCondition: false,
          }));
        }
        setLoader(false);
      })
      .catch((error) => {
        setSearchFlag(false);
        console.log(error, "error");
      });
  };

  const topicFilterHandler = (value) => {
    setLoader(true);
    let topics;
    let topicId;
    let condition = false;
    state.bounties?.map((bounty) => {
      topics = bounty.cob_cob_topic_cob_bounty;
      topics.map((topic) => {
        topicId = topic.cob_topicid;
      });
      if (topicId == value) {
        condition = true;
        setState((prevState) => ({
          ...prevState,
          filterTopics: [bounty],
          loading: false,
          topicCondition: true,
        }));
      }
    });

    if (condition === false) {
      setFilerDataCondition(true);
      setLoader(false);
    } else {
      setFilerDataCondition(false);
      setLoader(false);
    }
  };

  const getCategories = () => {
    if (_state.categorys) {
      setfilterState((prevState) => ({
        ...prevState,
        categories: _state.categorys,
        loading: false,
      }));
    } else {
      const categoriesUrl = `${appConfig.apiBaseUrl}categories`;
      axios
        .get(categoriesUrl)
        .then(({ status, data }) => {
          if (status === 200) {
            const categories = [...new Set(data)];
            const loading = false;
            setfilterState((prevState) => ({
              ...prevState,
              categories,
              loading,
            }));

            console.log("categories =>", categories);
          }
        })
        .catch((error) => {
          console.log("there was an error:", error);
        })
        .finally(() => {});
    }
  };
  if (state.loading && !state.bounties) {
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
        <FilterGrid>
          <FilterItemWrapper>
            <SearchField label="Search" />
          </FilterItemWrapper>
          <FilterItemWrapper>
            {filterState.categories && (
              <ComboBox
                label="Category"
                onSelectionChange={(value) => CategoryFilterHandler(value)}
                items={filterState.categories}
              >
                {(item) => (
                  <Item key={item.categoryId}>{item.categoryName}</Item>
                )}
              </ComboBox>
            )}
          </FilterItemWrapper>
          {subCategories && subCategories?.length > 0 && (
            <FilterItemWrapper>
              <ComboBox
                label="Sub Category"
                onSelectionChange={(value) => subCategoryFilterHandler(value)}
                items={subCategories}
              >
                {(item) => (
                  <Item key={item.subCategoryId}>{item.subCategoryName}</Item>
                )}
              </ComboBox>
            </FilterItemWrapper>
          )}
          {!!topics?.length && (
            <FilterItemWrapper>
              <ComboBox
                label="Topics"
                items={topics}
                onSelectionChange={(value) => {
                  topicFilterHandler(value);
                }}
              >
                {(item) => <Item key={item.topicId}>{item.topicName}</Item>}
              </ComboBox>
            </FilterItemWrapper>
          )}
        </FilterGrid>
        {loader && (
          <NewloadingWrapper>
            <LoadingWrapper>
              <div>
                <ProgressCircle
                  size="L"
                  aria-label="Loading…"
                  isIndeterminate
                />
              </div>
              <div>please wait...</div>
            </LoadingWrapper>
          </NewloadingWrapper>
        )}

        {!loader ? (
          <BountyGrid>
            {filerDataConditon ? (
              <NoData>No Match Found</NoData>
            ) : state.topicCondition ? (
              <BountyList
                filter={state.filterTopics}
                BountyDetails={goToBounty}
              />
            ) : (
              <BountyList filter={state.bounties} BountyDetails={goToBounty} />
            )}
          </BountyGrid>
        ) : null}
    </div>
  );
};

const Bounties = compose(withRouter, withFirebase)(BountiesBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Bounties);
