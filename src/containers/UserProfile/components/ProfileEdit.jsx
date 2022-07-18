import React from "react";
import styled from "styled-components";
import { Button } from "@adobe/react-spectrum";

const CardWrapper = styled.div`
  display: flex;
  padding: 16px;
  @media (max-width: 576px) {
    padding: 0 15px;
    max-width: 100%;
  }
  & .card {
    margin-top: 0;
  }
  & .card,
  & .edit_profile {
    @media (max-width: 576px) {
      width: 100%;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 3px;
`;

const ProfileEdit = ({ onSubmit, children, EditCancel }) => (
  <>
    <CardWrapper>
      <div className="card">
      <h2> 📜 User Profile</h2>
        <form onSubmit={onSubmit}>
          {children}
          <div className="edit_profile">
            <ButtonWrapper>
              <Button onPress={EditCancel} variant="cta" marginTop={"15px"}>
                Cancel
              </Button>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button type="submit" variant="cta" marginTop={"15px"}>
                save
              </Button>
            </ButtonWrapper>
          </div>
        </form>
      </div>
    </CardWrapper>
  </>
);

export default ProfileEdit;
