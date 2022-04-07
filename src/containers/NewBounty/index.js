import React from 'react';
import {Button, ComboBox, Item, ProgressCircle, TextArea, TextField} from '@adobe/react-spectrum'
import axios from 'axios';
import styled from 'styled-components';
import withAuthorization from '../../session/withAuthorization';
import { withFirebase } from '../../firebase';
import { compose } from 'recompose';
import withRouter from '../../session/withRouter';

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
    </BountyFormWrapper>
  );
}

const NewBounty = compose(withRouter, withFirebase)(NewBountyBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewBounty);
