import React from 'react';
import {
  Button,
  ComboBox,
  Item,
  ProgressCircle,
  Picker,
  TextArea,
  TextField
} from '@adobe/react-spectrum'
import {FcFullTrash} from 'react-icons/fc';
import axios from 'axios';
import styled from 'styled-components';
import withAuthorization from '../../session/withAuthorization';
import { withFirebase } from '../../firebase';
import { AppContext } from '../../context';

import { compose } from 'recompose';
import withRouter from '../../session/withRouter';

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

const sanitizeByKey = (arr, key) => [
  ...new Map(arr.map((item) =>  [item[key], item])).values(),
];

function NewBountyBase({ firebase, navigate }) {
  const [state, setState] = React.useState({ ...initialState });
  const [_state] = React.useContext(AppContext);
  const [categoryId, setCategoryId] = React.useState(null);
  const [subCategoryId, setSubCategoryId] = React.useState(null);
  const [topics, setTopics] = React.useState([]);
  const [selectedTopics, setSelectedTopics] = React.useState([]);
  const [description, setDescription] = React.useState('');
  const [requirements, setRequirements] = React.useState('');
  const [authUserId, setAuthUserId] = React.useState(null);
  React.useEffect(() => {
    if (_state.authUser && _state.authUser.uid) {
      setAuthUserId(_state.authUser.uid);
    }
  }, [_state.authUser]);
  console.log('authUserId =>', authUserId);
  React.useEffect(() => {
    if (subCategoryId && state.selected.subCategories) {
      const [results] = state.selected.subCategories.filter(x => x.subCategoryId === subCategoryId);
      setTopics(results.topics);
    }
    if (selectedTopics && selectedTopics.length) {
      setSelectedTopics([]);
    }
  }, [subCategoryId]);

  React.useEffect(() => {
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
    if (selectedTopics && selectedTopics.length) setSelectedTopics([]);
    if (topics?.length) setTopics([]);

    if (state.categories && isSubsribed) {
      const [selected] = state.categories.filter((x) => x.categoryId === categoryId);
      setState((prevState) => ({
        ...prevState,
        selected,
      }));
    }

    return () => isSubsribed = false;
  }, [categoryId]);

  const handleTopicChange = topicId => {
    const filtered = topics.filter(x => x.topicId === topicId);
    const merged = [
      ...selectedTopics,
      ...filtered
    ];
    const cleanTopics = sanitizeByKey(merged, 'topicId');
    setSelectedTopics(cleanTopics);
  }

  const handleDeleteTopic = topicId => {
    const filtered = selectedTopics.filter((x) => x.topicId !== topicId);
    setSelectedTopics(filtered);
  }

  const handleDescChange = (value) => {
    setDescription(value);
  }


  const handleReqChange = (value) => {
    setRequirements(value);
  }

  const handleSubmitNewBounty = () => {
    const toppers = selectedTopics.map(x => x.topicId);

    //http://localhost:4000/users/${authUserId}
    //http://localhost:4000/bounties/new
    axios.get(`http://localhost:4000/users/${authUserId}`)
      .then((response) => {
        if (response.data && response.data.value) {
          const { data: { value } } = response;
          const [result] = value;
          const blobject = {
            name: 'default',
            categoryId: [categoryId],
            subCategoryId: [subCategoryId],
            description,
            requirements: [requirements],
            topicIds: [...new Set(toppers)],
            accountId: result.accountid,
          }

          console.log('use this for next api call, blobject =>', blobject);
        }
      })
      .catch((error) => {
        console.log('there was error:', error);
      })
    console.log('blobject =>', blobject);

  }

  if (state.loading) {
    return (
      <div>
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </div>
    );
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
            {selectedTopics.map((item, idx) => (
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
            <TextField onChange={handleDescChange} width="auto" label="Description" />
            <TextArea onChange={handleReqChange} width="auto" label="Requirements" />
            <Button onPress={handleSubmitNewBounty} variant="cta">Create</Button>
          </>
        )}
    </BountyFormWrapper>
  );
}

const NewBounty = compose(withRouter, withFirebase)(NewBountyBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewBounty);
