import React from "react";
import styled from "styled-components";
import { Button, Heading } from "@adobe/react-spectrum";
import ReactStars from "react-rating-stars-component";

const CardWrapper = styled.div`
  display: flex;
  padding: 16px;
  flex: none !important;
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

const RatingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  & div {
    margin-left: 5px;
  }
`;

const Profile = ({
  onSubmit,
  src,
  telephone,
  linkedInUrl,
  gitHubUrl,
  email,
  first_name,
  last_name,
  customerRate,
  providerRate,
  edit,
  hashing,
  loginUser,
}) => (
  <>
    <CardWrapper>
      <div className="card">
        <h2> 📜 User Profile</h2>
        <RatingWrapper>
          <h4>Customer Rating</h4>:
          <ReactStars
            count={5}
            edit={false}
            value={customerRate}
            size={26}
            isHalf={true}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
          />
        </RatingWrapper>
        <RatingWrapper>
          <h4>Provider Rating</h4>:
          <ReactStars
            count={5}
            edit={false}
            value={providerRate}
            size={26}
            isHalf={true}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
          />
        </RatingWrapper>
        <form onSubmit={onSubmit}>
          <label className="custom-file-upload fas">
            <div className="img-wrap">
              <img src={src} />
            </div>
          </label>
          <div className="item_wrapper">
            <Heading marginBottom="10">
              <span style={{ color: "#766e6e" }}>First Name: </span>
              {first_name}
            </Heading>
            <Heading marginBottom="10">
              <span style={{ color: "#766e6e" }}>Last Name: </span>
              {last_name}
            </Heading>

            <Heading marginBottom="10">
              <span style={{ color: "#766e6e" }}>Telephone: </span>
              {loginUser ? telephone : hashing ? telephone : "########"}
            </Heading>

            <Heading marginBottom="10">
              <span style={{ color: "#766e6e" }}>User email: </span>
              {loginUser ? email : hashing ? email : "########"}
            </Heading>

            <Heading marginBottom="10">
              <span style={{ color: "#766e6e" }}>Github url: </span>
              {gitHubUrl}
            </Heading>

            <Heading marginBottom="10">
              <span style={{ color: "#766e6e" }}>LinekdIn url: </span>
              {linkedInUrl}
            </Heading>

            {edit !== false && (
              <Button
                type="submit"
                variant="cta"
                marginTop={"15px"}
                marginStart={"auto"}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </div>
    </CardWrapper>
  </>
);

export default Profile;
